<template>
  <div>
    <b-button type="" @click="isCardModalActive = true">
        Create Memo
    </b-button>
    <b-modal :active.sync="isCardModalActive" :width="640" scroll="keep">
        <div class="card">
          <div class="card-content">

            <v-select v-bind:options="languageOptions" v-model="selectedLanguage" placeholder="言語を選んでください"></v-select>

            <prism-editor 
              v-model="code" 
              :language="selectedLanguage"
              :line-numbers="true"
              ></prism-editor>

            <b-field>
                <b-input v-model="description" maxlength="200" type="textarea" class="form-description" placeholder="説明:)javascriptの変数まじ卍"></b-input>
            </b-field>

            <b-field>
              <b-input v-model="link" placeholder="参照サイト:) https://~~"></b-input>
            </b-field>

            <b-button @click="createMemo" type="">create</b-button>
          </div>
        </div>
    </b-modal>

      <b-input type="text" v-model="keyword" placeholder="Search..." expanded></b-input>

      <div v-for="memo in filterdMemo" :key="memo.id">
        <div class="box">
          <div class="content">
            <prism-editor 
              :code="memo.code"
              language="js"
              :line-numbers="true"
              readonly
            ></prism-editor>
            <div class="description">
              <p >{{memo.description}}</p>
              <div>参照サイト:<a :href="memo.link">{{memo.link}}</a></div>
            </div>
            
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import { db } from '../firebase'

export default {
  components: {
    PrismEditor
  },
  data () {
    return {
      readonly: false,
      keyword: '',
      memos: [],
      code: '',
      description: '',
      link: '',
      isCardModalActive: false,
      selectedLanguage: '',
      languageOptions: [
        'js',
        'css'
      ]
    }
  },
  created () {
    db.collection('memos').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const doc = change.doc
        if (change.type == 'added') {
          this.memos.unshift({ id: doc.id, ...doc.data() })
        }
      })
    })
  },
  computed: {
    filterdMemo () {
      const memos = []
      for (let i in this.memos) {
        const memo = this.memos[i]
        if (memo.code.indexOf(this.keyword) !== -1 || memo.description.indexOf(this.keyword) !== -1) {
          memos.push(memo)
        }
      }
      return memos
    }
  },
  methods: {
    async createMemo () {
      await db.collection('memos').add({
        code: this.code,
        description: this.description,
        link: this.link
      })
      this.code = ''
      this.description = ''
      this.isCardModalActive = false
    }
  }
}
</script>

<style scoped>
.box {
  margin-bottom: 1.5rem;
}

.form-description {
  margin: 1.5rem 0;
}

.description {
  text-align: left;
  padding: 1rem;
}
</style>