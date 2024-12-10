# Incognito

**Incognito** est un jeu social et interactif où chaque joueur doit découvrir l'identité secrète des autres participants tout en protégeant la sienne. À travers des questions et des réponses, le but est de percer le mystère des pseudos tout en restant incognito !

---

## 🎯 Objectif du jeu

Le but du jeu est simple :  
- **Devinez l'identité secrète de chaque joueur** derrière leur pseudo.  
- **Protégez votre propre identité** des autres joueurs.  

Pour cela, vous devrez poser des questions, répondre stratégiquement, et analyser les réponses des autres.

---

## 🕹️ Fonctionnement

1. **Attribution d'identités :** Chaque joueur reçoit une identité secrète en début de partie.
2. **Questions & Réponses :** Les joueurs posent et répondent à des questions pour recueillir des indices.
3. **Fin de partie :** Une fois la partie terminée :
   - Les joueurs ont **2 minutes** pour relire les anciens messages échangés et ajuster leurs réponses si nécessaire.
4. **Résultats :** Le joueur qui découvre le plus d'identités sans se faire découvrir est déclaré vainqueur.

---

## 🛠️ Caractéristiques techniques

- **Frontend :**
  - **HTML** : Structure de l'application.
  - **Tailwind CSS** : Style moderne et responsive.
  - **Angular** : Gestion de l'interface utilisateur et de la logique côté client.
- **Backend :**
  - **Node.js** : Serveur JavaScript côté serveur.
  - **Express** : Framework pour gérer les routes et les requêtes.
  - **Socket.io** : Communication en temps réel entre les joueurs.
- **Développement :**
  - **Nodemon** : Surveillance des changements pour relancer automatiquement le serveur.

Le jeu ne repose sur aucune base de données : toutes les interactions sont gérées en mémoire pendant la partie et aucune donnée n'est stockée après la fin de celle-ci.
