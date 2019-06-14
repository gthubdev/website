<template>
<div>
	<div class="md-layout">
		<div class="md-layout-item md-size-10 text-center text-info">
			{{ elapsed }} elapsed
		</div>
		<div class="md-layout-item text-cente text-center text-status" :class="racestateBg()">
			{{ racestate }}
		</div>
		<div class="md-layout-item md-size-10 text-center text-info">
			{{ remaining }} remaining
		</div>
	</div>
	<div class="class-badges">
		<md-chip md-clickable @click.native="badgeClicked('all')" :class="clb_all ? 'all-bg' : ''">All classes</md-chip>
		<md-chip md-clickable @click.native="badgeClicked('p1')" :class="clb_p1 ? 'lmp1-bg' : ''">LMP1</md-chip>
		<md-chip md-clickable @click.native="badgeClicked('p2')" :class="clb_p2 ? 'lmp2-bg' : ''">LMP2</md-chip>
		<md-chip md-clickable @click.native="badgeClicked('gp')" :class="clb_gp ? 'gtepro-bg' : ''">GTE-Pro</md-chip>
		<md-chip md-clickable @click.native="badgeClicked('ga')" :class="clb_ga ? 'gteam-bg' : ''">GTE-Am</md-chip>
	</div>
	<md-table v-if="data.entries !== undefined">
		<md-table-row>
			<md-table-head>Pos</md-table-head>
			<md-table-head>ClassPos</md-table-head>
			<md-table-head>State</md-table-head>
			<md-table-head>Class</md-table-head>
			<md-table-head>Nr</md-table-head>
			<md-table-head>Team</md-table-head>
			<md-table-head>Driver</md-table-head>
			<md-table-head>Car</md-table-head>
			<md-table-head>Gap</md-table-head>
			<md-table-head>GapPrev</md-table-head>
			<md-table-head>ClassGap</md-table-head>
			<md-table-head>ClassGapPrev</md-table-head>
			<md-table-head>Sector 1</md-table-head>
			<md-table-head>Best Sector 1</md-table-head>
			<md-table-head>Sector 2</md-table-head>
			<md-table-head>Best Sector 2</md-table-head>
			<md-table-head>Sector 3</md-table-head>
			<md-table-head>Best Sector 3</md-table-head>
			<md-table-head>Last Lap</md-table-head>
			<md-table-head>Best Lap</md-table-head>
			<md-table-head>Pitstops</md-table-head>
		</md-table-row>
		<md-table-row v-for="(e, index) in filterEntries()" :key="e.number" :class="tableRowClass(index, e.state)">
			<md-table-cell>{{ e.ranking }}</md-table-cell>
			<md-table-cell>{{ e.categoryPosition }}</md-table-cell>
			<md-table-cell :class="stateColour(e.state)">{{ e.state !== 'Chk' ? e.state.toUpperCase() : '' }}</md-table-cell>
			<md-table-cell><span :class="classBg(e.category)">{{ classDisplay(e.category) }}</span></md-table-cell>
			<md-table-cell>{{ e.number }}</md-table-cell>
			<md-table-cell>{{ e.team }}</md-table-cell>
			<md-table-cell>{{ e.driver }}</md-table-cell>
			<md-table-cell>{{ e.car }}</md-table-cell>
			<md-table-cell>{{ e.gap }}</md-table-cell>
			<md-table-cell>{{ e.gapPrev }}</md-table-cell>
			<md-table-cell>{{ e.classGap }}</md-table-cell>
			<md-table-cell>{{ e.classGapPrev }}</md-table-cell>
			<md-table-cell>{{ e.currentSector1 }}</md-table-cell>
			<md-table-cell>{{ e.bestSector1 }}</md-table-cell>
			<md-table-cell>{{ e.currentSector2 }}</md-table-cell>
			<md-table-cell>{{ e.bestSector2 }}</md-table-cell>
			<md-table-cell>{{ e.currentSector3 }}</md-table-cell>
			<md-table-cell>{{ e.bestSector3 }}</md-table-cell>
			<md-table-cell>{{ e.lastlap }}</md-table-cell>
			<md-table-cell>{{ e.bestlap }}</md-table-cell>
			<md-table-cell>{{ e.pitstop }}</md-table-cell>
		</md-table-row>
	</md-table>
</div>
</template>

<script>
export default {
	data: function() {
		return {
			data: [],
			elapsed: '',
			racestate: '',
			remaining: '',
			clb_all: true,
			clb_p1: false,
			clb_p2: false,
			clb_gp: false,
			clb_ga: false
		};
	},
	watch: {
		data: function(newValue) {
			if (newValue !== undefined) {
				this.elapsed = this.data.params.elapsedTime;
				this.remaining = this.data.params.remaining;
				// TODO, need to know the strings for yellow/red/etc.
				switch(this.data.params.racestate) {
					case 'green':
						this.racestate = 'RUNNING'; break;
					case 'Chk':
						this.racestate = 'FINISHED'; break;
					default:
						this.racestate = 'unknown';
				}
			}
		}
	},
	created() {
		this.sendRequest();
		this.fetchData();
	},
	methods: {
		async sendRequest() {
			const res = await this.$axios.$get('/api/wecdata');
			this.data = res.data;
		},
		fetchData: function() {
			setInterval(() => {
				this.sendRequest();
			}, 30 * 1000);
		},
		racestateBg: function() {
			if (this.data.params === undefined)
				return '';
			switch (this.data.params.racestate) {
				case 'green':
					return 'state-green';
				case 'Chk':
					return 'state-finished';
				default:
					return '';
			}
		},
		classBg: function(cat) {
			switch (cat) {
				case 'LMP1':
					return 'lmp1-bg';
				case 'LMP2':
					return 'lmp2-bg';
				case 'LMGTEPro':
					return 'gtepro-bg';
				case 'LMGTEAm':
					return 'gteam-bg';
			}
		},
		badgeClicked: function(cl) {
			switch (cl) {
				case 'all':
					this.clb_all = !this.clb_all;
					this.clb_p1 = false;
					this.clb_p2 = false;
					this.clb_gp = false;
					this.clb_ga = false;
					break;
				case 'p1':
					this.clb_all = false;
					this.clb_p1 = !this.clb_p1;
					break;
				case 'p2':
					this.clb_all = false;
					this.clb_p2 = !this.clb_p2;
					break;
				case 'gp':
					this.clb_all = false;
					this.clb_gp = !this.clb_gp;
					break;
				case 'ga':
					this.clb_all = false;
					this.clb_ga = !this.clb_ga;
					break;
				default:
					break;
			}
		},
		filterEntries: function() {
			if (Array.isArray(this.data.entries)) {
				if (this.clb_all)
					return this.data.entries;

				let arr = [];
				if (this.clb_p1)
					arr = arr.concat(this.data.entries.filter(function(entry) {
						return entry.category === 'LMP1';
					}));
				if (this.clb_p2)
					arr = arr.concat(this.data.entries.filter(function(entry) {
						return entry.category === 'LMP2';
					}));
				if (this.clb_gp)
					arr = arr.concat(this.data.entries.filter(function(entry) {
						return entry.category === 'LMGTEPro';
					}));
				if (this.clb_ga)
					arr = arr.concat(this.data.entries.filter(function(entry) {
						return entry.category === 'LMGTEAm';
					}));

				arr.sort((a,b) => {
					return a.ranking - b.ranking;
				});

				return arr;
			}
			else
				return [];
		},
		classDisplay: function(cl) {
			switch (cl) {
				case 'LMGTEPro':
					return 'GTE-Pro';
				case 'LMGTEAm':
					return 'GTE-Am';
				default:
					return cl;
			}
		},
		stateColour: function(state) {
			switch(state) {
				case 'Run':
					return 'state-run';
				case 'Chk':
					return 'state-finished';
			}
		},
		tableRowClass: function(index, state) {
			switch (state) {
				case 'Run':
					return index % 2 === 0 ? 'md-table-row-odd' : '';
				case 'Pit':
				case 'In':
					return 'md-table-row-pit';
				case 'Stop':
					return 'md-table-row-stop';
				case 'Out':
					return 'md-table-row-out';
				default:
					return '';
			}
		}
	}
};
</script>

<style>
body {
	padding: 1em
}

.text-center {
	text-align: center;
	vertical-align: middle;
}
.text-info {
	padding: 0.4em 0 0.4em 0;
	font-size: 20px
}
.text-status {
	padding: 0.4em 0 0.4em 0;
	font-size: 24px;
	font-weight: bold;
}
.state-green {
	background-color: green;
}
.state-yellow {
	background-color: yellow;
}
.state-red {
	background-color: red;
}
.state-finished {
	background-image:
		-moz-linear-gradient(45deg, #000 25%, transparent 25%),
		-moz-linear-gradient(-45deg, #000 25%, transparent 25%),
		-moz-linear-gradient(45deg, transparent 75%, #000 75%),
		-moz-linear-gradient(-45deg, transparent 75%, #000 75%);
	background-image:
		-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #000), color-stop(.25, transparent)),
		-webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #000), color-stop(.25, transparent)),
		-webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #000)),
		-webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #000));

	-moz-background-size:30px 30px;
	background-size:30px 30px;
	-webkit-background-size:30px 31px; /* override value for shitty webkit */

	background-position:0 0, 15px 0, 15px -15px, 0px 15px;
}
.class-badges {
	margin: 1em 0 0.5em 0
}
.md-table-head-label {
	text-align: left;
	padding: 0 1em 0 1em;
	font-size: 10pt;
}
.md-table-cell {
	height: 1em;
	padding-left: 0.6em
}
.all-bg {
	background-color: black !important
}
.lmp1-bg {
	background-color: red !important;
	padding: 0.3em;
	font-weight: bold
}
.lmp2-bg {
	background-color: blue !important;
	padding: 0.3em;
	font-weight: bold
}
.gtepro-bg {
	background-color: green !important;
	padding: 0.3em;
	font-weight: bold
}
.gteam-bg {
	background-color: orange !important;
	padding: 0.3em;
	font-weight: bold
}
.md-table-cell-container {
	padding: 0.4em 0.4em 0.4em 0.4em
}
.md-table-row-odd {
	background-color: #303030 !important;
}
.md-table-row-pit {
	background-color: rgba(255,0,0,0.35) !important
}
.md-table-row-out {
	background-color: rgba(255,200,0,0.3) !important
}
.md-table-row-stop {
	font-style: italic;
	opacity: 0.5
}
.state-run {
	color: #76FF03
}
</style>
