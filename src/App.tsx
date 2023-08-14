import { Redirect, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import Home from './pages/Home'

import { ElectricDatabase, electrify } from 'electric-sql/wa-sqlite'

import { authToken } from 'electric-sql/auth'

import { Electric, schema } from './generated/client'

import { ElectricProvider } from './context'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'

setupIonicReact({
  // mode: 'ios',
})

/* Setup Electric Auth */
const localAuthToken = (): Promise<string> => {
  const issuer = 'local-development'
  const signingKey = 'local-development-key-minimum-32-symbols'

  return authToken(issuer, signingKey)
}

const App: React.FC = () => {
  const [electric, setElectric] = useState<Electric>()

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const config = {
        auth: {
          token: await localAuthToken(),
        },
      }

      const conn = await ElectricDatabase.init('todo.db', '')
      const electric = await electrify(conn, schema, config)

      if (!isMounted) {
        return
      }

      setElectric(electric)
    }

    init()

    return () => {
      isMounted = false
    }
  }, [])

  if (electric === undefined) {
    return null
  }

  return (
    <ElectricProvider db={electric}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact={true}>
              <Redirect to="/home" />
            </Route>
            <Route path="/home" exact={true}>
              <Home />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </ElectricProvider>
  )
}

export default App
