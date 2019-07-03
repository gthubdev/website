<template>
<section>
	<div class="container">
		<div class="first">
			<div class="line" />
			<h1 class="title">
				GTHub
			</h1>
			<div class="line mobile" />
			<p class="subtitle">
				The motorsports Discord you need.<br /> Join <span class="bold">more than 1000</span> car and motorsports enthusiasts <br /> with the click of a button!
			</p>
			<md-button id="join" class="md-raised md-primary login" href="http://discord.gg/jeHEW8X">
				JOIN US
			</md-button>
		</div>
		<div class="second">
			<img src="img/01.png" alt="Picture of a Lamborghini race car" />
		</div>
	</div>
</section>
</template>

<script>

export default {
	components: {}
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato:400,700,900&display=swap');

.container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 0;
	grid-auto-rows: minmax(100px, auto);
	margin: -1em 10em;
	height: 91.4vh;
}

.first, .second {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.line {
	height: 5px;
	width: 18vw;
	background: linear-gradient(to right, #ed6400 0%, #df1652 100%);
}

.title, .subtitle {
	font-family: 'Lato', sans-serif;
}

.title {
	font-weight: 900;
	font-style: italic;
	font-size: 7vw;
	margin: 0.8em -0.1em;
}

.line.mobile {
	display: none;
}

.subtitle {
	font-weight: 400;
	font-size: 1vw;
	color:white;
	line-height: 2;
	margin: 0 0 3em;
} 

.bold {
	color: #df1652;
	font-weight: 800;
}

.container .md-button {
	width: 10em;
	height: 3em;
	border-radius: 10px;
	background-image: linear-gradient(to right, #ed6400 0%, #df1652 100%);
	margin: 0;
}

.second img {
	width: 100%;
	min-width: 50vw;
}

@media screen and (max-width: 888px){
	.container {
		display: flex;
		flex-direction: column;
		margin: -1em 5em 0;
	}

	.first {
		width: 100%;
		height: 91.4vh;
		align-items: center;
	}

	.second {
		display: none;
	}

	.line {
		display: none;
	}

	.line.mobile {
		display: block;
		margin-bottom: 4em;
		width: 45vw;
	}

	.title {
		font-size: 20vw;
		margin: 0 0 0.6em;
	}

	.subtitle {
		text-align: center;
		font-size: 4vw;
	}
	
}
</style>
