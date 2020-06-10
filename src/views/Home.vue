<template>
  <div>
    <b-modal :active.sync="isCardModalActive" :width="640" scroll="keep">
        <div class="card modal-radius">
          <div class="card-content">

            <v-select v-bind:options="languageOptions" v-model="selectedLanguage" placeholder="言語を選んでください"></v-select>

            <prism-editor 
              v-model="code" 
              :language="selectedLanguage"
              :line-numbers="true"
            ></prism-editor>

            <b-field>
                <b-input v-model="description" maxlength="200" type="textarea" class="form-description" placeholder="説明)javascriptの変数まじ卍"></b-input>
            </b-field>

            <b-field>
              <b-input v-model="link" placeholder="参照サイト) https://~~"></b-input>
            </b-field>

            <v-select :options="options" v-model="selected" multiple ></v-select>

            <b-button @click="createMemo" type="" class="createButton">create</b-button>
          </div>
        </div>
    </b-modal>

      <div class="actionBox">
        <b-input class="searchFunc" type="text" v-model="keyword" placeholder="Search..." expanded></b-input>

        <b-button class="" type="" @click="isCardModalActive = true">
            Create
        </b-button>
      </div>

      <div v-for="memo in filterdMemo" :key="memo.id">
        <div class="box">
          <div class="content">
            <prism-editor 
              :code="memo.code"
              :language="memo.selectedLanguage"
              :line-numbers="true"
              readonly
            ></prism-editor>
            <div class="description">
              <p >{{memo.description}}</p>
              <div>参照サイト:<a :href="memo.link">{{memo.link}}</a></div>
              <span v-for="category in memo.categories" :key="category.name">
                {{ category }}
              </span>
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
      ],
      selected: '',
      options: [
        'Ruby',
        'Rails',
        'Javascript',
        'CSS'
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
        link: this.link,
        categories: this.selected,
        selectedLanguage: this.selectedLanguage
      })
      this.code = ''
      this.description = ''
      this.isCardModalActive = false
      this.selected = ''
    }
  }
}
</script>

<style scoped>
.modal-radius {
  border-radius: 10px !important;
}

.box {
  margin-bottom: 1.5rem;
}

.v-select {
  margin: 10px 0;
  width: 50%;
}

.form-description {
  margin: 1.5rem 0;
}

.description {
  text-align: left;
  padding: 1rem;
}

.actionBox {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.searchFunc {
  width: 600px;
}

.createButton {
  width: 100%;
}
</style>