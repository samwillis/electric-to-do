import ToDoListItem from '../components/TodoListItem'
import { useEffect } from 'react'
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react'
import { addOutline } from 'ionicons/icons'
import { useLiveQuery } from 'electric-sql/react'
import { genUUID } from 'electric-sql/util'
import { useElectric } from '../context'
import { Items as Item } from '../generated/client'
import './Home.css'

const Home: React.FC = () => {
  const { db } = useElectric()!
  useEffect(() => void db.items.sync(), [])

  const { results } = useLiveQuery(
    db.items.liveMany({
      orderBy: {
        added: 'desc',
      },
    }),
  )

  const items: Item[] = results !== undefined ? results : []

  const addItem = async () => {
    await db.items.create({
      data: {
        id: genUUID(),
        title: 'New Task',
        done: 0, // Electric doesn't support booleans yet
        added: Math.round(Date.now() / 1000),
      },
    })
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={addItem}>
              <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Electric To Do</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {items.map((item) => (
            <ToDoListItem key={item.id} item={item} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Home
