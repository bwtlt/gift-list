import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import styles from '../../styles/BirthList.module.scss'

export default function Item(props) {
  const item = props.item
  const [gifted, setGifted] = useState(item?.gifted)
  let component
  let image = '/items/dejaoffert.jpeg'

  if (item?.image) {
    image = '/items/' + item?.image
  }

  if (gifted) {
    component = <div className={styles.giftedContainer}>
      <div className={styles.gifted}>Déjà offert</div>
    </div>
  } else if (item?.giftable === false) {
    component = <></>
  } else {
    component = <div className={styles.giftedContainer}>
      <div className={styles.giftingButtons}>
        <button className={styles.giftButton} role="button" onClick={
          () => {
            setGifted(true)
            const updater = {}
            updater.gifted = true
            const itemRef = props.database.collection('christmas2023').doc(item?.id)
            itemRef.update(updater)
              .then(() => {
                console.log('Document successfully updated!')
              })
              .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating document: ', error)
              })
          }
        }>Réservé par le Père Noël</button>
      </div>
    </div>
  }

  return (
    <>
      <div className={styles.item}>
        <div className={styles.itemImageContainer}>
          <Image className={gifted ? styles.giftedItemImage : styles.itemImage} src={image} layout="fill" objectFit="contain" alt="Item image"></Image>
        </div>
        <div className={styles.itemInfo}>
          <div className={styles.itemSpecs}>
            <div className={styles.itemName}>{item?.name}</div>
            {item?.description &&
              <div className={styles.itemDescription}>
                {item?.description.replaceAll('\\n', '\n')}
              </div>}
            {(!gifted && item?.price) && <div className={styles.itemPrice}>{item?.price}€</div>}
            {item?.link && <a target="_blank" rel="noreferrer" href={item?.link} className={styles.itemLink}>Lien</a>}
          </div>
          {component}
        </div>
      </div>
    </>
  )
}

Item.propTypes = {
  item: PropTypes.object,
  database: PropTypes.object
}
