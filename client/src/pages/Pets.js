import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'


// operation type + operation name
const ALL_PETS = gql`
  query AllPets {
    pets {
      id
      name
      type
      img
    }
  }
`

// operation type + operation name
// name of the mutation
const ADD_PET = gql `
  mutation CreatePet($newPet: NewPetInput!) {
    addPet(input: $newPet) { 
      id
      name
      type
      img
    }
}
`

export default function Pets () {
  const [modal, setModal] = useState(false)
  const {data, loading, error} = useQuery(ALL_PETS)
  const [createPet, newPet] = useMutation(ADD_PET, {
    update(cache, {data: {addPet}}) {
      const data = cache.readQuery({query:ALL_PETS})
      cache.writeQuery({
        query: ALL_PETS,
        data: {pets: [addPet, ...data.pets]}
      })
    }
  })

  const onSubmit = input => {
    setModal(false)
    createPet({
      variables: { newPet: input },
      optimisticResponse: {
        __typename: 'Mutation',
        addPet: {
          __typename: 'Pet',
          id: Math.random(Math.random() * 10000) + '',
          name: input.name,
          type: input.type,
          img: 'https://via.placeholder.com/150',
        }
      },
    })
  }

  if (loading) {
    return <Loader />
  }

  if (error || newPet.error) {
    return <p>Error!</p>
  }
  
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets}/>
      </section>
    </div>
  )
}
