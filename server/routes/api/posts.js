const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
const gltfPipeline = require('gltf-pipeline');

const router = express.Router();
const posts = mongoose.model('Post');

const upload = multer();

const S3_BUCKET = process.env.S3_BUCKET_NAME;
const aws = require('aws-sdk');
aws.config.region = "us-east-2";


router.get('/', async (req, res) => {
	res.send(await posts.find({}).exec());
});

router.post('/', upload.any(), async (req, res) => {
	const file = req.files[0];
	const fileName = file.originalname;
	const fileType = file.mimetype;
	const gltf = JSON.parse(file.buffer.toString('ascii'));
	const s3 = new aws.S3();

	// console.log(file, gltf);

	const s3Params = {
		Bucket: S3_BUCKET,
		Key: fileName,
		// Expires: 60,
		ContentType: fileType,
		ACL: 'public-read',
	};

	//step 1
	const getSignedRequest = () => {
		return new Promise((resolve) => {
			s3.getSignedUrl('putObject', s3Params, (err, data) => {

				if (err) {
					console.log(err);
					return res.end();
				}

				//signed request url
				resolve(data);

			});
		})
	};

	//step 2
	const uploadFile = (file, signedRequest) => {
		try {
			axios.put(signedRequest, file)
				.then(() => createPost())

		} catch (error) {
			console.error(error)
		}
	};

	//step 3
	const createPost = () => {
		const postData = {
			title: req.body.title,
			slug: req.body.title.replace(/\s+/g, '-').toLowerCase(),
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		};

		posts.create(postData, (err, result) => {
			if (err) {
				res.status(500);
				return false;
			}
			console.log('post created', postData);

			res.status(201).send(result);
		});
	};

	//already compressed
	if (gltf.extensionsUsed && gltf.extensionsUsed.indexOf('KHR_draco_mesh_compression') !== -1) {
		console.log('already compressed');
		getSignedRequest(s3Params, res)
			.then(signedRequest => uploadFile(gltf, signedRequest))
	}

	//otherwise apply DRACO compression
	else {
		const processGltf = gltfPipeline.processGltf;
		const options = {
			dracoOptions: {
				compressionLevel: 4,
			}
		};
		

		await processGltf(gltf, options)
			.then((results) => {
				const compressed = results.gltf;

				console.log('compressed');

				getSignedRequest(s3Params, res)
					.then(signedRequest => uploadFile(compressed, signedRequest))


			})
			.catch(err => {
				console.log(err);
				res.status(500).send(err);
			});
	}
});




module.exports = router;