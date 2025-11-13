import { redirect } from 'next/navigation'

/**
 * Homepage - Redirect automatico al configuratore
 * Il configuratore legno è standalone, quindi redirect diretto a /configura
 */
export default function Home() {
  redirect('/configura')
}
