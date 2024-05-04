import React from 'react'

interface ErrorProps {
    text: string
}

const Error_Handler:React.FC<ErrorProps> = ({text}) => {
  return (
    <div className='error_status'>
        {text}
    </div>
  )
}

export default Error_Handler
