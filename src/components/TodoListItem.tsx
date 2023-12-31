import {
  IonItem,
  IonCheckbox,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonInput,
} from '@ionic/react'
import { useRef, useState } from 'react'
import { useElectric } from '../context'
import { Items as Item } from '../generated/client'
import './ToDoListItem.css'
import debounce from 'lodash.debounce'

interface ToDoListItemProps {
  item: Item
}

const ToDoListItem: React.FC<ToDoListItemProps> = ({ item }) => {
  const { db } = useElectric()!
  const titleIsDirty = useRef(false)
  const [dirtyTitle, setDirtyTitle] = useState(item.title)

  const deleteItem = async () => {
    await db.items.delete({
      where: {
        id: item.id,
      },
    })
  }

  const doneChanged = async (event: CustomEvent) => {
    await db.items.update({
      where: {
        id: item.id,
      },
      data: {
        done: event.detail.checked ? 1 : 0,
      },
    })
  }

  const titleChanged = async (event: CustomEvent) => {
    await db.items.update({
      where: {
        id: item.id,
      },
      data: {
        title: event.detail.value,
      },
    })
    titleIsDirty.current = false
  }

  const debouncedTitleChanged = debounce((event: CustomEvent) => {
    titleIsDirty.current = true
    setDirtyTitle(event.detail.value)
    titleChanged(event)
  }, 500)

  return (
    <IonItemSliding>
      <IonItem>
        <IonInput
          aria-label="Task Title"
          value={titleIsDirty.current ? dirtyTitle : item.title}
          onIonInput={debouncedTitleChanged}
          style={{
            textDecoration: item.done === 1 ? 'line-through' : 'none',
          }}
        ></IonInput>
        <IonCheckbox
          slot="end"
          labelPlacement="start"
          aria-label="Done"
          checked={item.done === 1}
          onIonChange={doneChanged}
        ></IonCheckbox>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={deleteItem}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  )
}

export default ToDoListItem
