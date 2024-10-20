import React, { useState, useEffect } from 'react'
import firebase from '../lib/firebase'
import 'firebase/firestore'
import 'firebase/storage'
import Head from 'next/head'
import Image from 'next/legacy/image'
import Item from './components/Item'
import Script from 'next/script'
import styles from '../styles/BirthList.module.scss'
import { useAuth } from '../context/AuthUserContext'

const email = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMAIL
const db = firebase.firestore()
const CATEGORIES = ['Jeux de construction',
  'Jeux de société',
  'Loisirs créatifs',
  'Jeux éducatifs',
  'Plein air',
  'Garde robe',
  'Musique',
  'Jeux d\'imagination',
  'Livres'
]

export default function Home () {
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
                  <p className={styles.introRaw}>
                    Cher Père Noël,<br />
                    Je m&apos;appelle Romy, j&apos;ai 22 mois,<br />
                    Mon Papa et ma Mama ont emménagé dans un énoorme appartement, j&apos;ai une chambre à moi toute seule ! C&apos;est vraiment très chouette. Alors je veux pleiiiin de cadeaux, j&apos;adore Mickey et Minnie.<br />
                    Des cadeaux mais pas trop trop car j&apos;ai aussi mon anniversaire, et puis ma Mama n&apos;est pas trop d&apos;accord, tu comprend elle lit des livres du style &quot;Le minimalisme bla bla bla&quot;...<br />
                    Père Noel, tu peux me croire sur parole : je suis vraiment très très sage,<br />
                    Est-ce que dormir la nuit ça compte pour avoir des cadeaux ? (oups)<br />
                    Merci Père Noël.<br />
                    Romy Anouch Watelet.<br />
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
                  {giftedItems.length === 0
                    ? <div>Rien pour le moment</div>
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
