import React, { Component } from 'react';
import {PieChart, Pie, Legend, Tooltip, Cell,ResponsiveContainer} from 'recharts'; 

const COLORS = ['#79d4a7','#eac459','#ffaa98','#1f90e5']
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = outerRadius + 25;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);
 
  return (
    <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'}  dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class TwoSimplePieChart extends Component {
	render () {
  	return (
      <ResponsiveContainer width={350} height={440}>
      	<PieChart className="postpies">
          <Pie  data={this.props.piedata} cx="50%" cy="60%" innerRadius={50} outerRadius={100} fill="#8884d8" label={renderCustomizedLabel}>
            {
              this.props.piedata.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index} />)
            }
          </Pie>
          <Legend height={36}/>
          {/*<Pie data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d"/>*/}
          <Tooltip wrapperStyle={{background:'#000',color:'#fff'}}/>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default TwoSimplePieChart;

