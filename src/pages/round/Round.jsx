import { api,ENDPOINTS } from 'api/api';
import React, { useEffect, useState } from 'react'

const Round = () => {
    const [random,setrandom] = useState([]);
    const fetchrandom = async() => {
        try {
            const response = await api.get(`${ENDPOINTS.RAMDOM}`);
            setrandom(response.data);
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(()=>{
        fetchrandom()
    },[])
     
    const cominground = random.filter((r)=>{
        return r.status == 2;
    })

    console.log(cominground)
  return (
    <>
    <div>Round</div>

    <table>
        <thead>
            <tr>
                <th>Roundno</th>
                <th>Firstnumber</th>
                <th>Secondnumber</th>
                <th>Thirdnumber</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            {cominground && cominground.map((r)=>(
                <tr>
                    <td>{r.roundno}</td>
                    <td>{r.a}</td>
                    <td>{r.b}</td>
                    <td>{r.c}</td>
                    <td>{r.total}</td>
                </tr>
            ))}
        </tbody>
    </table>
    </>
  )
}

export default Round;
