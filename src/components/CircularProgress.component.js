import React from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function CircularProgressWithLabel(props) {
  const percentColors = [
    { pct: 0.0, color: { r: 0x00, g: 0xff, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } }];

  const getColorForPercentage = (pct) => {
    for (var i = 1; i < percentColors.length - 1; i++) {
      if (pct < percentColors[i].pct) {
        break;
      }
    }
    let lower = percentColors[i - 1];
    let upper = percentColors[i];
    let range = upper.pct - lower.pct;
    let rangePct = (pct - lower.pct) / range;
    let pctLower = 1 - rangePct;
    let pctUpper = rangePct;
    let color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex', marginRight: '20px', marginLeft: '5px' }}>
      <CircularProgress
        variant="determinate"
        style={{color:'#eeeeee1c'}}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress 
      variant="static" {...props} 
      style={{position: 'absolute', animationDuration: '1500ms', color: getColorForPercentage(props.value / 100)}} />
      <div style={{position: 'absolute', display: 'flex', top: '0px', left: '0px', bottom: '0px', right: '0px', alignItems:"center", justifyContent:"center"}}>
        <Typography variant="caption" component="div" color="initial">{`${Math.round(props.value,)}${props.unit}`}</Typography>
      </div>
    </div>
  );
}