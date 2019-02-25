<template>
	<form @submit.prevent="signUp($event)">
		<input class="d-block" type="text" name="email"/><br>
		<input class="d-block" type="password" name="password"/><br>
		<p v-if="error">{{error.message}}</p>
		<input class="btn-primary" type="submit" value="Sign Up"/>
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
	            'SIGN_UP'
            ]),
            signUp(e) {
                let email = e.target.elements.email.value;
                let password = e.target.elements.password.value;

                this.error = null;

                this.SIGN_UP({ email, password })
	                .then(() => this.$emit('done'))
                    .catch( err => {
                        this.error = err;
                    });
            },
        }
    }
</script>