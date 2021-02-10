<template>
<section>
	<div class="p-grid p-justify-center index-container">
		<div class="p-col-4">
			<!--<div class="headline-sep-line" />-->
			<div class="index-headline">
				GTHub
			</div>
			<p class="index-subhead">
				The motorsports Discord you need.<br>
				Join <span class="bold">more than 1500</span> car and motorsports enthusiasts<br>
				with the click of a button!
			</p>
			<p>
				<span id="join" class="join-btn btn-primary">
					<a href="http://discord.gg/jeHEW8X">JOIN US</a>
				</span>
			</p>
		</div>
		<div class="p-col-6">
			<img src="~/assets/img/LamboSplash.png" alt="Picture of a Lamborghini race car" class="index-img">
		</div>
	</div>
</section>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.index-img {
	width: 100%;
}
.bold {
	color: #df1652;
	font-weight: 800;
}
.join-btn {
	padding: .75em 3em .75em 3em;
	border-radius: 20px;
}
a {
	color: #f7f7f7;
	text-decoration: none;
}
</style>
