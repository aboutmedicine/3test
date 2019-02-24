<template>
	<div class="search">
		<v-select label="name" :filterable="false" :options="options" @search="onSearch">
			<template slot="no-options">
				type to search articles..
			</template>
			<template slot="option" slot-scope="option">
				<div class="d-center">
					{{ option.name }}
				</div>
			</template>
			<template slot="selected-option" slot-scope="option">
				<div class="selected d-center">
					{{ option.name }}
				</div>
			</template>
		</v-select>
	</div>
</template>

<script>
	import { HttpService } from "@/http";

    function debounce(callback, wait, immediate = false) {
        let timeout = null

        return function () {
            const callNow = immediate && !timeout
            const next = () => callback.apply(this, arguments)

            clearTimeout(timeout)
            timeout = setTimeout(next, wait)

            if (callNow) {
                next()
            }
        }
    }
    export default {
        data: () => ({
            options: []
        }),
        methods: {
            /**
             * Accepts a callback function that will be run
             * when the search text changes. The callback
             * will be invoked with these parameters:
             *
             * @param {search}  String        Current search text
             * @param {loading} Function    Toggle loading class
             */
            onSearch(search, loading) {
                loading(true);
                this.search(loading, search, this);
            },
            search: debounce((loading, search, vm) => {
                HttpService.searchArticles(escape(search))
	                .then(res => {
	                    console.log(res);
                        vm.options = res;
                        loading(false);
	                })
            }, 350),

        }
    }
</script>

<style lang="scss">

	.search {
		flex: 0 80%;
		align-self: center;
		margin-left: 1em;
		margin-right: 1em;
		max-width: 540px;
	}

	.d-center {
		display: flex;
		align-items: center;
	}

	.selected img {
		width: auto;
		max-height: 23px;
		margin-right: 0.5rem;
	}

	.v-select .dropdown li {
		border-bottom: 1px solid rgba(112, 128, 144, 0.1);
	}

	.v-select .dropdown li:last-child {
		border-bottom: none;
	}

	.v-select .dropdown li a {
		padding: 10px 20px;
		width: 100%;
		font-size: 1.25em;
		color: #3c3c3c;
	}

	.v-select .dropdown-menu .active > a {
		color: #fff;
	}
</style>