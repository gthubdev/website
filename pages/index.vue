<template>
<section>
	<div class="grid grid-cols-10 w-3/4 justify-center m-auto mt-20">
		<div class="col-span-4">
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
		<div class="col-span-6">
			<img src="~/assets/img/LamboSplash.png" alt="Picture of a Lamborghini race car">
		</div>
	</div>
</section>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.index-headline {
	@apply px-4 py-0 text-gray-200 text-9xl font-black italic;
}
.index-subhead {
	@apply mb-12 leading-loose text-gray-200 text-xl font-bold;
}
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
