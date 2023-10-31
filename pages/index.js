import React, { useState, useEffect } from 'react'
import firebase from '../lib/firebase'
import 'firebase/firestore'
import 'firebase/storage'
import Head from 'next/head'
import Image from "next/legacy/image"
import Item from './components/Item'
import Script from 'next/script'
import styles from '../styles/BirthList.module.scss'
import { useAuth } from '../context/AuthUserContext'

const email = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMAIL
const db = firebase.firestore()
const storage = firebase.storage()
const CATEGORIES = ['Jeux de construction',
  'Jeux de société',
  'Jeux d\'éveil',
  'Jeux éducatifs',
  'Plein air'
]

export default function Home() {
  const [category, setCategory] = useState('Tout')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const { authUser, signInWithEmailAndPassword } = useAuth()
  const [items, setItems] = useState([])
  const [giftedItems, setGiftedItems] = useState([])
  const [loadedDb, setLoadedDb] = useState(false)

  useEffect(() => {
    if (authUser && !loadedDb) {
      setLoading(true)
      setGiftedItems([])
      setItems([])
      db.collection('christmas2023').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const item = doc.data()
          item.id = doc.id
          if (item.gifted && !item?.number) {
            setGiftedItems(giftedItems => [...giftedItems, item])
          } else {
            setItems(items => [...items, item])
          }
        })
      })
      // Get the download URL
      storage.ref().child('IMG_1731.jpeg').getDownloadURL()
        .then((url) => {
          console.log('coucou' + url)
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              console.log('file doesnt exist')
              break
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.log('permission error')
              break
            case 'storage/canceled':
              // User canceled the upload
              console.log('canceled')
              break

            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              console.log('unknown')
              break
          }
        })
      setLoading(false)
      console.log('Items retrieved succesfully')
      setLoadedDb(true)
    }
  }, [authUser, loadedDb])

  const filterItem = (item) => {
    const categoryMatches = category === 'Tout' || item.category === category
    return !item.hidden && categoryMatches
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Liste au Père Noël</title>
        <meta name="description" content="La liste au Père Noël de Romy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Script src="https://kit.fontawesome.com/c9688da9a5.js" crossorigin="anonymous"></Script>
        <div className={styles.header}>
          <div className={styles.title}>(La liste au Père Noël de Romy)</div>
        </div>
        <div className={styles.body}>
          {loading && <div>Chargement en cours...</div>}
          {!loading && authUser === null &&
            <form className={styles.login} onSubmit={async (e) => {
              setLoading(true)
              signInWithEmailAndPassword(email, password)
                .then(() => {
                  console.log('Log in succesful')
                })
                .catch((error) => {
                  console.error(error)
                })
              e.preventDefault()
            }}>
              <label htmlFor="password">Mot de passe : </label>
              <input className={styles.passwordField} type="password" id="password" name="password" required onChange={(event) => setPassword(event.target.value)} />
              <input type="submit" value="Entrer" className={styles.gifterFormButton} />
            </form>
          }
          {authUser &&
            <>
              <div className={styles.intro}>
                <div className={styles.introText}>
                  <p className={styles.introRaw}>Cher Père Noël,
                    <br></br>
                    Je m&apos;appelle Romy Anouch W, j&apos;ai 11 mois,
                    <br></br>
                    Nous ne nous connaissons pas encore, je suis née seulement l&apos;année dernière.
                    <br></br>
                    Mon arrivée dans ce monde à comblé de joie Mama, Papa, ma Mamie et mon Papy Patou,
                    mon Papy et ma Mamie Marie, Tonton, Tatie, mes Marraines...
                    <br></br>
                    Tu peux me croire sur parole : je suis vraiment très très sage,
                    <br></br>
                    Est-ce que la nuit ça compte pour avoir des cadeaux ? (hihi)
                    <br></br>
                    Je suis encore trop petite pour découper moi même mes souhaits dans les catalogues de jouet.
                    <br></br>
                    Mais Papa et Mama m&apos;ont observé m&apos;amuser avec mes copains
                    et ont noté quelques jouets que j&apos;aimerais bien avoir pour continuer à apprendre, bouger et me divertir.
                    Les voilà,
                    <br></br>
                    Merci Père Noël.
                    <br></br>
                    RAW.
                    <br></br>
                  </p>
                  <p className={styles.introParents}>
                    Note de Papa et Mama : Il existe plus de mille jouet sur les plateformes comme Le bon coin, Vinted...
                    ou encore dans les vide-greniers... alors même si les lutins du Père Noël travaillent surement très très bien,
                    on aimerait vraiment que vous fassiez l&apos;effort de vous tourner vers de l&apos;occasion
                    (dans la mesure du possible),
                    <br></br>
                    Il faut penser à la planète qu&apos;on laissera à Romy plus tard...
                    <br></br>
                    Ce n&apos;est pas une liste exhaustive, faites vous plaisir, et cela lui fera forcement plaisir.
                    Nous ne tenons pas à savoir qui offre quoi, pour avoir la surprise nous aussi (oui, on adore la Magie de Noël)
                    <br></br>
                    Alors il vous suffit de cliquer sur &quot;Réserver &quot;
                    <br></br>
                    Vous pouvez revenir en arrière à tout moment.
                    <br></br>
                    Merci.
                    <br></br>
                    L & B
                  </p>
                </div>
                <div className={styles.introImageContainer}>
                  <Image className={styles.introImage} src="/intro.jpeg" layout="fill" objectFit="contain" alt="Les heureux parents"></Image>
                </div>
              </div>
              <form action="#" className={styles.filterControls}>
                <label>Filtres : </label>
                <select className={styles.select} name="category" id="categorySelect" value={category} onChange={(e) => {
                  setCategory(e.target.value)
                }}>
                  <option value="Tout">Catégorie...</option>
                  {CATEGORIES.map((cat) => {
                    return (<option value={cat} key={cat}>{cat}</option>)
                  })}
                </select>
                <button className={styles.filterButton} onClick={(e) => {
                  e.preventDefault()
                  setCategory('Tout')
                }}>Réinitialiser</button>
              </form>

              <div className={styles.sublistTitle}>Catégorie : {category}</div>
              <>
                <div className={styles.list}>
                  {items.filter((item) => filterItem(item)).map((item) => {
                    return (<Item key={item.id} item={item} database={db} />)
                  })}
                </div>
              </>
              <>
                <div className={styles.sublistTitle}>Déjà réservés par le Père Noël</div>
                <div className={styles.list}>
                  {giftedItems.length === 0 ?
                  <div>Rien pour le moment</div>
                    : giftedItems.filter((item) => filterItem(item)).map((item) => {
                      return (<Item key={item.id} item={item} database={db} />)
                    })}
                </div>
              </>

            </>
          }
        </div>
        <div className={styles.footer}>Site créé par L&B</div>
      </main>
    </div>
  )
}
