// 柱状图组件
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'
// 组件的封装
// 1. 不变的功能代码->小组件
// 2. 可变的部分->prop参数

const BarChart = ({ title }) => {
  const chartRef = useRef(null)
  useEffect(() => {
    // useEffect 在第一次JSX渲染完成后执行 
    // [] 空依赖：只在组件第一次渲染后执行一次
    // 保证dom可用 才进行图表的渲染
    // 1. 获取渲染图表的dom节点
    const chartDom = chartRef.current

    // 2. 图表初始化生成图表实例对象
    const myChart = echarts.init(chartDom)

    // 3. 准备图表参数
    const option = {
      title: {
        text: title
      },
      xAxis: {
        type: 'category',
        data: ['Vue', 'React', 'Angular']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [10, 40, 70],
          type: 'bar'
        }
      ]
    }
    // 4. 使用图表参数完成图表的渲染
    option && myChart.setOption(option)

  }, [title])
  return (
    <div
      ref={chartRef} style={{ width: '500px', height: '400px' }}>
    </div>)
}

export default BarChart