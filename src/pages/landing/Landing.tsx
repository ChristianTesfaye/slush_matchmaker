import React from 'react';
import PersonTile from '../../components/PersonTile/PersonTile';
import './landing.scss'
import {Person} from '../../types/Person';
import {Request} from '../../types/Request';
import { useAuth } from '../../providers/AuthProvider';
import { useEffect, useState } from 'react';
import axios from '../../modules/axios/axios_wrapper';
import LoadingSpinner from '../../components/Spinner/Spinner';

const Landing: React.FC = () => {
    const [people, setPeople] = useState<Person[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const auth = useAuth();

    useEffect(()=>{
        // await new Promise(r => setTimeout(r, 2000));
        setIsLoading(true)
        axios.get("/users")
        .then(response => {
            console.log("response: ", response)
            var responseArray = response.data as Array<any>;
            var people: Person[] = [];
            for(var person of responseArray){
                var incomingRequests: Request[] = [];
                var outgoingRequests: Request[] = [];
                for(var request of person.IncomingRequests){
                    console.log("CREWTING REQ" , request)
                    var requestObj: Request = {
                        id: request.id,
                        time: request.id,
                        fromUser: request.fromUser,
                        toUser: request.toUser,
                        status: request.status,
                        updatedAt: request.updatedAt,
                        message: request.message,
                        createdAt: request.createdAt
                    }
                    incomingRequests.push(requestObj)
                }
                for(var request of person.OutgoingRequests){
                    var requestObj: Request = {
                        id: request.id,
                        time: new Date(Date.parse(request.time)),
                        fromUser: request.fromUser,
                        toUser: request.toUser,
                        status: request.status,
                        updatedAt: request.updatedAt,
                        createdAt: request.createdAt
                    }
                    outgoingRequests.push(requestObj)
                }

                console.log(incomingRequests)
                var obj: Person = {
                    firstName: person.firstName,
                    lastName: person.lastName,
                    id: person.id,
                    organization: person.organization,
                    
                    incomingRequests: person.IncomingRequests?.shift(),
                    outgoingRequests: person.OutgoingRequests?.shift()
                }
                console.log("Parsed Person", obj)
                people.push(obj)
            }
            console.log(people)
            setPeople(people)
        }).finally(()=>{
            setIsLoading(false)
        })
    }, [])
    return (
        
        <div className='landing-component'>
            <div className='content-wrapper'>   
                <p className="header">Meet Awesome People from Around the World</p>
                <div className={`people-list ${isLoading?"spinner-container":""}`}>
                    {
                        !isLoading?(people.map((person, i) => {
                            console.log(auth?.id)
                            if(person.id == auth?.id){
                                return
                            }
                            return(<PersonTile person={person} key={person.id} incoming={person.incomingRequests} outgoing={person.outgoingRequests}></PersonTile>)
                        })): <LoadingSpinner/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Landing