import utils from '../utils.js'
export default {
  state: {
    tests: {
      canCreateVK: {
        name: 'Can Create Vault Keep',
        success: false,
        routeInfo: {
          path: '/vaultkeeps',
          data: 'vaultkeep {vaultId, keepId}',
          description: 'This will map a vaultkeep relationship. It needs a vaultId, a keepId, and a userId. You should add your userId from the backend.'
        }
      },
      canGetVK: {
        name: 'Can Get Vault Keeps',
        success: false,
        routeInfo: {
          path: '/vaultkeeps/:vaultId',
          response: 'keeps[]',
          description: 'Get request. This will get all the keeps that match the vaultId on the vaultkeep relationship table.'
        }
      },
      canDeleteVK: {
        name: 'Can Delete Vault Keep',
        success: false,
        routeInfo: {
          path: '/vaultkeeps',
          data: 'vaultkeep',
          description: 'Put request. This will delete a vaultkeep relationship. It needs a vaultId, a keepId, and a userId.'
        }
      }
    },
    vaultKeep: {},
    user: {},
    keep: {},
    vault: {}
  },
  mutations: {
    setVKState(state, prop) {
      state.tests[prop].success = true
    },
    setVaultKeep(state, payload) {
      state.vaultKeep = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setVaultForVK(state, payload) {
      state.vault = payload
    },
    setKeepForVK(state, payload) {
      state.keep = payload
    }
  },
  actions: {
    // getVaultKeeps({ commit, dispatch })
    getKeep({ commit, dispatch }) {
      utils.api.get('keeps')
        .then(res => {
          commit('setKeepForVK', res.data[0])
          dispatch('getVault')
        })
    },
    getVault({ commit, dispatch }) {
      utils.api.get('vaults')
        .then(res => {
          commit('setVaultForVK', res.data[0])
          dispatch('createVaultKeep')
        })
    },
    createVaultKeep({ commit, dispatch, state }) {
      debugger
      let vaultKeep = {
        vaultId: state.vault.id,
        keepId: state.keep.id
      }
      utils.api.post('vaultkeeps', vaultKeep)
        .then(res => {
          debugger
          commit('setVKState', 'canCreateVK')
          commit('setVaultKeep', vaultKeep)
          dispatch('getVaultKeeps')
        }).catch(err => console.error(err))
    },
    getVaultKeeps({ commit, dispatch, state }) {
      utils.api.get('vaultkeeps/' + state.vaultKeep.vaultId)
        .then(res => {
          commit('setVKState', 'canGetVK')
          dispatch('deleteVaultKeep')
        }).catch(err => console.error(err))
    },
    deleteVaultKeep({ commit, state }) {
      utils.api.put('vaultkeeps/', state.vaultKeep)
        .then(res => {
          commit('setVKState', 'canDeleteVK')
        })
        .catch(err => console.error(err))
    }
  }
}