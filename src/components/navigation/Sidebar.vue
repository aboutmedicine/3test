<template>
	<nav class="nav-primary">
		<div id="open-sidenav" class="sidenav-button" @click="open = true">
			<i class="fa fa-bars"></i>
		</div>

		<div id="sidenav" class="sidenav" :style="`width: ${open ? '250px' : '0px'}`">
			<div id="close-sidenav" class="sidenav-button" @click="open = false">
				<i class="fa fa-times"></i>
			</div>

			<div class="header">
				<slot name="header">
					<h5>Navigation</h5>
				</slot>
			</div>

			<slot name="items"></slot>

			<a id="night-mode" @click="$store.commit('TOGGLE_THEME')">
				{{ $theme.dark ? 'Day' : 'Night'}} Mode
			</a>

			<a @click="dialog.login = true" v-if="!user">Log In</a>
			<a @click="LOG_OUT" v-if="user">Log Out</a>

			<app-modal v-if="dialog.login" @close="dialog.login = false">
				<strong slot="header">Log In</strong>
				<LogIn slot="body" @done="dialog.login = false"></LogIn>
				<!--<div slot="footer">
					Don't have an account?
					<button class="btn-sm btn-info"
					        @click="dialog.login = false; dialog.signup = true">
						Sign up!
					</button>
				</div>-->
			</app-modal>

			<app-modal v-if="dialog.signup" @close="dialog.signup = false">
				<strong slot="header">Sign Up</strong>
				<SignUp slot="body" @done="dialog.signup = false"></SignUp>
			</app-modal>

			<a href="mailto:reuben.schmidt@icloud.com">Contact</a>
		</div>
	</nav>

</template>

<script>
    import LogIn from '@/components/auth/LogIn'
    import SignUp from '@/components/auth/SignUp'

    import { mapState, mapActions } from 'vuex'

    export default {
        components: { LogIn, SignUp },
        data: () => ({
            open: false,
            dialog: {
                login: false,
                signup: false
            }
        }),
        computed: {
            ...mapState([
                'user'
            ])
        },
        methods: {
            ...mapActions([
                'LOG_OUT'
            ])
        }
    }
</script>

<style lang="scss">

	.sidenav-button {
		position: absolute;
		color: #ccc;
		top: 36px;
		right: 8px;
		width: 48px;
		height: 48px;
		font-size: 32px;
		margin: 0px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: .2s;
		z-index: 1;
		@media (max-width: 767px) {
			top: 10px;
			right: 0;
		}
	}

	.sidenav-button:hover,
	.sidenav a:hover {
		color: var(--dark-grey);
		cursor: pointer;
	}

	.sidenav {
		height: 100%;
		width: 0px;
		position: fixed;
		z-index: 3;
		top: 0;
		right: -2px;
		background-color: #fff;
		overflow: hidden;
		transition: 0.2s;
		border-left: 2px solid #eeeeee;
	}

	.sidenav a {
		padding: 8px 28px 8px 16px;
		text-decoration: none;
		font-size: 16px;
		color: var(--dark-grey);
		display: block;
		transition: 0.2s;
		font-weight: 500;
		overflow: hidden;
		min-width: 240px;
	}

	.sidenav-icon {
		float: right;
	}

</style>