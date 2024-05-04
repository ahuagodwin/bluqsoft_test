import React from 'react'


// Defining Progress_Bar functional component by accepting props ProgressProps
const Progress_Bar:React.FC<ProgressProps> = ({percent, statusText}) => {
  return (
<div className="custom-progress-bar">
   {/* Rendering the progress bar with dynamic width based on percent */}
      <div className={`progress-bar ${statusText}`} style={{ width: `${percent}%` }}>
        <span className="progress-text">{percent}%</span>
      </div>
    </div>
  )
}

export default Progress_Bar
