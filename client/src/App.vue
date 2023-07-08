<template>
	<div>
		<main class="main">
			<form v-if="!authenticated">
				<input
					type="text"
					placeholder="Email Address"
					v-model="email"
				/>
				<input
					type="password"
					placeholder="Password"
					v-model="password"
				/>
				<input type="submit" value="Sign Up" @click.prevent="onSignup"/>
				<input type="submit" value="Login" @click.prevent="onLogin" />
			</form>
			<form @submit.prevent="onLogout" v-if="authenticated">
				<h1>You're Logged In!</h1>
				<br>
				<input type="submit" value="Logout" />
			</form>
		</main>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref } from 'vue'
	import axios from 'axios'
	import { useCookies } from "vue3-cookies";

	axios.defaults.withCredentials = true
	export default defineComponent({
		setup() {
			const { cookies } = useCookies() as any
			return { cookies }
		},
		data() {
			return {
				email: "" as string,
				password: "" as string,
				authenticated: false as boolean,
			}
		},
		computed: {
			checkCookie() {
				if (this.cookies.get('connect.sid')) {
					return true
				} else {
					return false
				}
			},
		},
		methods: {
			onSignup() {
				try {
				axios
				.post("/api/signup", { 
					email: this.email,
					password: this.password,
				})
				.then((response) => {
					this.authenticated = true
				}, (error) => {
					throw error || new Error(`Request failed`);
				})
				} catch(error:any) {
				}
			},
			onLogin() {
				try {
				axios
				.post("/api/login", { 
					email: this.email,
					password: this.password,
				})
				.then((response) => {
					this.authenticated = true
				}, (error) => {
					throw error || new Error(`Request failed`);
				})
				} catch(error:any) {
					// Consider implementing your own error handling logic here
					alert(error.message);
				}
			},
			onLogout() {
				try {
					axios
					.post("/api/logout")
					.then((response) => {
						this.authenticated = false
					}, (error) => {
						throw error || new Error(`Request failed`);
					})
				} catch(error:any) {
					// Consider implementing your own error handling logic here
					console.error(error);
					alert(error.message);
				}
			},
		},
		mounted(){
			this.authenticated = this.checkCookie
		}
	});
</script>

<style>
  @font-face {
    font-family: "ColfaxAI";
    src: url(https://cdn.openai.com/API/fonts/ColfaxAIRegular.woff2)
        format("woff2"),
      url(https://cdn.openai.com/API/fonts/ColfaxAIRegular.woff) format("woff");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "ColfaxAI";
    src: url(https://cdn.openai.com/API/fonts/ColfaxAIBold.woff2) format("woff2"),
      url(https://cdn.openai.com/API/fonts/ColfaxAIBold.woff) format("woff");
    font-weight: bold;
    font-style: normal;
  }
  .main,
  .main input {
    font-size: 16px;
    line-height: 24px;
    color: #353740;
    font-family: "ColfaxAI", Helvetica, sans-serif;
  }
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
  }
  .main .icon {
    width: 34px;
  }
  .main h3 {
    font-size: 32px;
    line-height: 40px;
    font-weight: bold;
    color: #202123;
    margin: 16px 0 40px;
  }
  .main form {
    display: flex;
    flex-direction: column;
    width: 320px;
  }
  .main input {
    padding: 12px 16px;
    border: 1px solid #10a37f;
    border-radius: 4px;
    margin-bottom: 24px;
    outline-color: #10a37f;
  }
  .main ::placeholder {
    color: #8e8ea0;
    opacity: 1;
  }
  .main input[type="submit"] {
    padding: 12px 0;
    color: #fff;
    background-color: #10a37f;
    border: none;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
  .main .result {
    font-weight: bold;
    margin-top: 40px;
  }
</style>