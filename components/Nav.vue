
<template>
<div>
	<nav class="topnav">
		<a href="/" class="logoref">
			<img class="logo" src="~/assets/img/GTHubNoBackground.svg" alt="GTHub's logo" />
		</a>
		<div class="buttonContainer">
			<md-button class="md-primary" href="/">
				Home
			</md-button>
			<md-button class="md-primary" href="/calendar">
				Calendar
			</md-button>
			<md-button class="md-primary" @click="testClick()">
				Gallery
			</md-button>
			<md-button class="md-primary" @click="testClick()">
				About
			</md-button>
			<md-button class="md-primary" href="/resources">
				Resources
			</md-button>
			<md-button class="md-raised md-primary btn-primary" @click="testClick()">
				Log In
			</md-button>
			<md-button class="icon md-primary" @click="responsive()">
				<md-icon style="color:white;">
					menu
				</md-icon>
			</md-button>
		</div>
	</nav>
</div>
</template>


<script>
export default {
  name: 'Navigation',
  methods: {
    testClick: function() {
      alert('Don\'t click that button, idiot!');
    },
    responsive: function() {
      var x = document.getElementsByTagName('nav')[0];
      if (x.className === 'topnav') {
        x.className += ' responsive';
      } else {
        x.className = 'topnav';
      }
    }
  }
};
</script>