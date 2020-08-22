<template>
	<div class="card_wrap">
		<div class="card">
			<div class="title">
				<span>{{ userName }}</span> 的风格测试结果
			</div>
			<div class="desc">
				<img class="img" src="../../assets/quot_left.png" alt />
				<div class="content">
					<div class="label" :class="{ mr: i != 0 }" v-for="(item, i) in explanation.category_name" :key="i">
						{{ item }}
					</div>
				</div>
				<img class="img" src="../../assets/quot_right.png" alt />
			</div>
			<div class="thumbnail">
				<span v-for="(v, i) in explanation.result" :key="i">{{ v }}</span>
			</div>
			<div class="comment">{{ explanation.content }}</div>
			<div class="chart">
				<div class="pic" ref="chart"></div>
				<img src="https://hjapi.51hejia.com/mmexport1592376066582.jpg" alt class="avater" />
			</div>
		</div>
	</div>
</template>
<script>
  import {api_getTestResult} from '../../api'

  export default {
	components: {},
	data() {
		return {
			userName: "郭仙女",
			arr: ["现代简约", "美式", "欧式", "地中海", "日式"],
			explanation: {
				category_name: "",
				content: "",
				result: "",
			},
			score_list: [],
		};
	},
	created() {
		this.result();
	},
	methods: {
		result() {
			this.$ajax(api_getTestResult, {}).then((res) => {
				console.log("测试结果", res);
				if (res.code == 200) {
					let categoryName = [];
					let explanation = res.result.explanation;
					this.explanation = explanation;
					this.explanation.result = explanation.result.split("，");
					this.explanation.category_name = explanation.category_name.split("");
					this.score_list = res.result.score_list.slice(0, 5);
					let scorArr = [];
					let score_list = this.score_list.map((item) => {
						scorArr.push(item.score);
						return { text: item.type_name, max: 2, min: -2 };
					});
					this.initCharts(score_list, scorArr);
				}
			});
		},
		initCharts(score_list, scorArr) {
			let myChart = this.$echarts.init(this.$refs.chart);
			console.log(this.$refs.chart); // 绘制图表
			myChart.setOption({
				radar: [
					{
						name: {
							textStyle: {
								color: "#333333",
								fontSize: 26,
							},
						},
						indicator: score_list,
						center: ["50%", "50%"],
						startAngle: 90,
						splitNumber: 3,
						splitArea: {
							areaStyle: {
								color: "#ffffff",
							},
						},
					},
				],
				series: [
					{
						// name: '成绩单',
						// [10, 91, 80, 30, 70
						type: "radar",
						data: [
							{
								value: scorArr,
								// name: '李四',
								lineStyle: {
									color: "rgba(255, 48, 71, 0.5)",
								},
								areaStyle: {
									opacity: 0.6,
									color: "rgba(255, 48, 71, 0.12)",
								},
							},
						],
					},
				],
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.card_wrap {
	padding-top: 40px;
}
.card {
	width: 620px;
	height: 1034px;
	background: #ffffff;
	border-radius: 40px;
	overflow: hidden;
	margin: 0px auto;
	padding: 38px 34px;
	.title {
		color: #333333;
		font-size: 30px;
		font-family: "PingFangSC-Medium,PingFang SC";
		span {
			font-size: 34px;
			font-weight: bold;
		}
	}
	.desc {
		margin-top: 74px;
		margin-bottom: 72px;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		.img {
			width: 36px;
			height: 30px;
		}
		.content {
			height: 112px;
			font-size: 72px;
			font-family: "FZDBSJW--GB1-0,FZDBSJW--GB1";
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			margin: 0px 20px;
			.label {
				width: 104px;
				height: 108px;
				text-align: center;
				line-height: 108px;
				background-image: url("../../assets/line.png");
				background-repeat: no-repeat;
				background-size: 104px 108px;
				&.mr {
					margin-left: -6px;
				}
			}
		}
	}
	.thumbnail {
		display: flex;
		justify-content: center;
		margin-bottom: 36px;
		span {
			line-height: 32px;
			padding: 10px;
			background: #e4f0fe;
			color: #4490f6;
			font-size: 22px;
			font-family: "PingFangSC-Regular,PingFang SC";
			margin-right: 10px;
			border-radius: 4px;
			overflow: hidden;
		}
	}
	.comment {
		font-family: "PingFangSC-Regular,PingFang SC";
		font-size: 26px;
		color: #333333;
		line-height: 36px;
		margin-bottom: 52px;
	}
	.chart {
		position: relative;
		margin: 0 auto;
		width: 500px;
		height: 500px;
		.img {
			width: 262px;
			height: 250px;
		}
		.avater {
			display: block;
			width: 50px;
			height: 50px;
			box-sizing: border-box;
			border: 2px solid #ffffff;
			border-radius: 50%;
			overflow: hidden;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -20px);
		}
	}
	.pic {
		width: 500px;
		height: 500px;
	}
}
</style>
