import React from 'react'
import './requestHistory.scss'
import PersonTile from '../../components/PersonTile/PersonTile'
import axios from '../../modules/axios/axios_wrapper'
import { useEffect, useState } from 'react'
import { Request } from '../../types/Request'
import { AxiosResponse } from 'axios'
import { Person } from '../../types/Person'
import LoadingSpinner from '../../components/Spinner/Spinner'

const RequestHistory: React.FC = () => {
    const [incomingRequests, setIncomingRequests] = useState<Person[]>([])
    const [outgoingRequests, setOutgoingRequests] = useState<Person[]>([])
    const [loadingIncoming, setLoadingIncoming] = useState(true)
    const [loadingOutgoing, setLoadingOutgoing] = useState(false)

    const parsePersonFromResponse = (response: AxiosResponse, incoming: boolean = true): Person[] => {
        var requests: Person[] = [];
        for(var request of response.data){
            var requestObj: Request = {
                id: request.id,
                fromUser: request.fromUser,
                toUser: request.toUser,
                status: request.status,
                time: new Date(Date.parse(request.time)),
                message: request.message
            }
            var userObj = incoming? request.FromUser : request.ToUser
            var personObj: Person = {
                id: userObj.id,
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                organization: userObj.organization,
                outgoingRequests: incoming? undefined: requestObj,
                incomingRequests: !incoming? undefined: requestObj,
            }
            console.log(personObj)
            requests.push(personObj)
        } 
        return requests;
    }

    useEffect(()=>{
        setLoadingIncoming(true)
        axios.get("/requests/incoming")
        .then(response => {
            var requests = parsePersonFromResponse(response)
            console.log("REQQQQUESTS: ", requests)
            setIncomingRequests(requests)
        }).finally(()=>setLoadingIncoming(false))
    }, [])

    useEffect(()=>{
        setLoadingOutgoing(true)
        axios.get("/requests/outgoing")
        .then(response => {
            setOutgoingRequests(parsePersonFromResponse(response, false))
        }).finally(()=>setLoadingOutgoing(false))
    }, [])


    return (
        <div className='request-history-component'>
            <div className="title-container">
                <p>Request History</p>
            </div>

            <div className='requests'>
                <div className="incoming">
                    <p className="section-title">Incoming Requests</p>
                    <div className={`request-list ${loadingIncoming? "spinner-container": ""}`}>
                        {
                            !loadingIncoming?(incomingRequests.map(person => {
                                console.log("GOT ONE LOL")
                                return (<PersonTile person={person} outgoing={person.incomingRequests}></PersonTile>)
                            })):<LoadingSpinner/>
                        }
                        
                        {/* <PersonTile person={{}}></PersonTile>
                        <PersonTile person={{}}></PersonTile>
                        <PersonTile person={{}}></PersonTile>
                        <PersonTile person={{}}></PersonTile> */}
                    </div>
                </div>
                <div className="spacer">

                </div>
                <div className="outgoing">
                    <p className="section-title">Outgoing Requests</p>
                    <div className={`request-list ${loadingOutgoing? "spinner-container": ""}`}>
                        {
                            !loadingOutgoing?(outgoingRequests.map(person => {
                                console.log("GOT ONE LOL")
                                return (<PersonTile person={person} incoming={person.outgoingRequests}></PersonTile>)
                            })): <LoadingSpinner/>
                        }
                        {/* <PersonTile person={{}}  outgoing={{}}></PersonTile>
                        <PersonTile person={{}}></PersonTile>
                        <PersonTile person={{}}></PersonTile>
                        <PersonTile person={{}}></PersonTile>
                        <PersonTile person={{}}></PersonTile> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestHistory