<template>
	<form @submit.prevent="logIn($event)">
		<input class="d-block" type="text" name="email"/><br>
		<input class="d-block" type="password" name="password"/><br>
		<p v-if="error">{{error.message}}</p>
		<input class="btn-primary" type="submit" value="Log In"/>
	</form>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        data: () => ({
            error: false
        }),
        methods: {
            ...mapActions([
                'LOG_IN',
            ]),
            logIn(e) {
                let email = e.target.elements.email.value;
                let password = e.target.elements.password.value;

                this.error = null;
                
                this.LOG_IN({ email, password })
	                .then(() => this.$emit('done'))
	                .catch( err => {
	                    // console.log(err);
	                    this.error = err;
	                })
            },
        }
    }
</script>