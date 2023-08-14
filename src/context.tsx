import { Electric } from './generated/client'
import { makeElectricContext } from 'electric-sql/react'

export const { ElectricProvider, useElectric } = makeElectricContext<Electric>();
