import { useState } from 'react'
import './App.css'
import { URL } from './const';
import Answer from './components/Answers';
import { _parseObjectDataRadialScale } from 'chart.js/helpers';


function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')))
  const payload = {
    "contents": [{
      "parts":[{"text": question}]
    }]
  }
  const askQuestion = async()=>{
    if(localStorage.getItem('history')){
      let history = JSON.parse(localStorage.getItem('history'))
      history = [question,...history]
      localStorage.setItem('history',JSON.stringify(history))
      setRecentHistory([history])
    }else{
      localStorage.setItem('history',JSON.stringify([question]))
      setRecentHistory([question])
    }
    console.log(recentHistory)
    
    let response = await fetch(URL,{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify(payload)
    })
    response = await response.json()
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ")
    dataString = dataString.map((item)=>item.trim())
    // console.log(dataString);

    setResult([...result,{type:'q',text:question},{type:'a', text:dataString}])
  
  }
  console.log(result)
  const clearHistory = ()=>{
    localStorage.clear();
    setRecentHistory([])
  }
  return (
    <div className="h-screen grid grid-cols-5  text-center">
      {/* Sidebar */}
      <div className="w-1/5 col-span-1  bg-zinc-500 fixed top-0 left-0 h-screen">
        {/* sidebar content here */}
        <h1 className='text-xl text-white pt-2 flex  justify-center text-center'>Recent Search
          <button onClick={clearHistory} className='pl-1 cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" height="23px"  viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
        </h1>
        
        <ul className='text-left overflow-auto '>
          {
            recentHistory && recentHistory.map((item)=>(
              <li className=' truncate p-1 pl-4 text-black cursor-pointer hover:bg-zinc-500 hover:text-amber-50'>
                {
                  item
                }

              </li>
            ))
          }
        </ul>
      </div>

      {/* Main content */}
      <div className="ml-[20%] col-span-4 w-4/5-10">
      
        <div className="container h-140  ">
          <h1 className=' font-bold bg-gradient-to-r from-purple-500 to-pink-900 bg-clip-text text-transparent text-5xl pl-4 text-center  pt-8'> Welcome To Aries-AI</h1>
          <div className='text-white pt-10  '>
            <ul>
            {
              result.map((item,index)=>(
                <div key={index + Math.random()} className={item.type =='q'?'flex justify-end':''}>
                  {
                     item.type =='q'?<li className='text-right  p-1 border-7 bg-purple-900 border-zinc-500 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit' key={index + Math.random}>
                <Answer ans={item.text} totalResult = {1} index = {index} type = {item.type} /></li>
                :item.text.map((ansItem,ansIndex)=>(
                  <li className='text-left p-1' 
                  key={ansIndex + Math.random()}>
                <Answer ans={ansItem} totalResult = {item.length} type = {item.type} index = {ansIndex} /></li>

                ))
                  }
                </div>

              ))
            }
            </ul>
            
          </div>
          
        </div>


        <div className= "bg-zinc-700  w-1/2 p-1 pr-5 text-white m-auto rounded-4xl border border-purple-400 flex h-16">
          <input
            type="text" value={question} onChange={(event)=>setQuestion(event.target.value)}
            className="w-full h-full p-3 outline-none"
            placeholder="Ask Me Anything"
          />
          <button className='cursor-pointer hover:text-blue-200 ' onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
  )
}

export default App
