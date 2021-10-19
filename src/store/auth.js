import firebase from 'firebase/app'

export default{
  actions: {
    async login({dispatch, commit},{email, password}) {
      try {
        
        await firebase.auth().signInWithEmailAndPassword(email, password)
        
        localStorage.email = email
        localStorage.dispatch = dispatch
      } catch (e){
        alert(e)
        localStorage.email = null
        commit('setError', e)
        throw e
      }
    },
    async register({dispatch, commit}, {email, password, name}) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        const uid = await dispatch('getUid')
        localStorage.uid = uid
        await firebase.database().ref(`/users/${uid}/info`).set({
          bill: 10000,
          name
        })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    getUid() {
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    },
    deleteUser() {
      const user = firebase.auth().currentUser
      const uid = user ? user.uid : null
      firebase.auth().deleteUser(uid).then(function() {
        alert('Successfully deleted user');
      })
      .catch(function(error) {
        alert('Error deleting user:' + error);
      });
    },
    async loguot() {
      await firebase.auth().signOut()
    },
    deleteUserUid({dispatch, commit}, uid) {

      //var user = firebase.auth().currentUser;
      alert("uid " + uid)
      
      var user = firebase.auth().getUser(uid);

      user.delete().then(function() {
        // User deleted.
        alert('Successfully deleted user');
      }).catch(function(error) {
        // An error happened.
        alert('Error deleting user:' + error);
        localStorage.dispatch = dispatch
        commit('setError', error)
        throw error
      });
    },

    signUserInGoogle ({commit}) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photoUrl: user.photoURL
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            //console.log(error)
          }
        )
    },

  }
}
