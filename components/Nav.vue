
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

<style>
.topnav .logoref {
  height: inherit;
}

.topnav .logo {
  width: auto;
  height: 100%;
  min-width: 5em;
  padding-top: 5px;
  padding-bottom: 5px;
}

.topnav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-image: linear-gradient(to right, #ed6400 0%, #df1652 100%);
  border-image-slice: 1;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 4px solid;
  margin-right: 10em;
  margin-left: 10em;
  padding-right: 2.5em;
  padding-left: 2.5em;
  padding-bottom: 5px;
  padding-top: 5px;
  height: 5em;
}

.topnav .md-button-content {
  color: white;
}

.topnav .icon {
  display: none;
}

@media screen and (max-width: 600px) {
  .topnav {
    margin-right: 5em;
    margin-left: 5em;
  }

  .topnav button:not(:last-child) {
    display: none;
  }

  .topnav a.md-button {
    display: none;
  }

  .topnav .icon {
    display: inline-block;
  }
}

@media screen and (max-width: 1100px) {
  .topnav.responsive {
    flex-direction: column;
    padding-right: 0;
    padding-left: 0;
    position: relative;
  }

  .topnav.responsive .logo {
    padding-bottom: 13px;
  }

  .topnav.responsive button {
    margin-left: 8px;
  }

  .topnav.responsive button:not(:last-child) {
    display: inline-block;
  }

  .topnav.responsive a.md-button {
    display: inline-block;
    margin-left: 8px;
  }

  .topnav.responsive .md-raised {
    width: 10em;
  }

  .topnav.responsive .buttonContainer {
    border-image: linear-gradient(to right, #ed6400 0%, #df1652 100%);
    border-image-slice: 1;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 4px solid;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    background-color: #262d34;
  }
}

@media screen and (max-width: 1100px) {
  .topnav {
    margin-right: 5em;
    margin-left: 5em;
  }

  .topnav button:not(:last-child) {
    display: none;
  }

  .topnav a.md-button {
    display: none;
  }

  .topnav .icon {
    display: inline-block;
  }
}
</style>
