<template>
  <div>
    <b-modal :active.sync="isCardModalActive" :width="800" scroll="keep">
        <div class="card modal-radius">
          <div class="card-content">

            <v-select v-bind:options="languageOptions" v-model="selectedLanguage" placeholder="言語を選択"></v-select>
            
            <div class="set-language">
              <prism-editor 
                v-model="code" 
                :language="selectedLanguage"
                :line-numbers="true"
              ></prism-editor>
              <span v-if="selectedLanguage" class="set-language-child">{{selectedLanguage}}</span>
            </div>
            

            <b-field>
                <b-input v-model="description" :rows="rows" type="textarea" class="form-description" placeholder="javascriptの変数まじ卍"></b-input>
            </b-field>

            <b-field>
              <b-input v-model="link" placeholder="参考にしたサイト、書籍など"></b-input>
            </b-field>

            <v-select :options="options" v-model="selected" multiple placeholder="タグを入力"></v-select>

            <b-button @click="createMemo" type="" class="createButton2" :disabled="isDisabled">create</b-button>
          </div>
        </div>
    </b-modal>

      <div class="actionBox">
        <div>
          <b-input class="searchFunc" type="text" v-model="keyword" placeholder="Search..." expanded></b-input>
          <div v-for="(category,index) in categories" :key="index" class="checkbox check_box">
            <input type="checkbox"  v-model="category.checked" class="check_box" :id="index">
            <label class="label" :for="index">{{ category.value }}</label>
          </div>
        </div>
        

        <b-button class="createButton1" type="" @click="isCardModalActive = true">
            Create
        </b-button>
      </div>

      <div v-for="memo in filterdMemo" :key="memo.id">
        <div class="box">
          <div class="content">
            <div class="set-language">
              <prism-editor 
                :code="memo.code"
                :language="memo.selectedLanguage"
                :line-numbers="true"
                readonly
              ></prism-editor>
              <span v-if="memo.selectedLanguage" class="set-language-child">{{memo.selectedLanguage}}</span>
            </div>
            <div class="description">
              <p>{{memo.description}}</p>
              <div v-if="memo.link" class="sitelink">参照サイト:<a :href="memo.link">{{memo.link}}</a></div>
              <b-tag rounded v-for="category in memo.categories" :key="category.name">
                {{ category }}
              </b-tag>
              <a class="delete is-large delete-btn" @click="deleteMemo(memo.id)"></a>
            </div>
            
          </div>
        </div>
      </div>

  </div>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import language from '../assets/language'
import categories from '../assets/categories.json'
import tags from '../assets/tags'
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
      languageOptions: language,
      selected: '',
      options: tags,
      categories: categories
    }
  },
  created () {
    db.collection('memos').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const doc = change.doc
        if (change.type == 'added') {
          this.memos.unshift({ id: doc.id, ...doc.data() })
        } else if (change.type == 'removed') {
          const index = this.memos.findIndex(v => v.id == doc.id)
          this.memos.splice(index, 1)
        }
      })
    })
  },
  computed: {
    rows () {
      const line = this.description.match(/\n/g)
      if (line == null) return 5
      return Math.max(line.length + 1, 5)
    },
    filterdMemo () {
      return this.memos.filter(memo => {
        return (
          (memo.code.indexOf(this.keyword) !== -1 || memo.description.indexOf(this.keyword) !== -1)
          && 
          (this.selectedCheckboxes.every(val => memo.categories.indexOf(val) >= 0))
        )
      })
    },
    selectedCheckboxes () {
			const filters = []
      const checkedBoxes = this.categories.filter(category => category.checked)
			checkedBoxes.forEach(element => {
				filters.push(element.value)
      })
			return filters
		},
    isDisabled () {
      return !this.code
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
      this.link = ''
      this.selectedLanguage = ''
    },
    deleteMemo(memoId) {
      this.$buefy.dialog.confirm({
        message: '本当に削除しますか？',
        onConfirm: () => {
          db.collection('memos').doc(memoId).delete()
          this.$buefy.toast.open('削除されました')
        }
      })
    }
  }
}
</script>

<style scoped>
.card-content {
  padding: 2rem !important;
}

.modal-radius {
  border-radius: 10px !important;
}

.box {
  margin-top: 2rem;
  position: relative;
}

.v-select {
  margin: 10px 0;
  width: 50%;
}

.form-description {
  margin-top: 1.5rem;
}

.description {
  text-align: left;
  padding: 1rem;
}

.actionBox {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
}

.searchFunc {
  width: 600px;
}

.createButton1 {
  color: #393e46;
  background-color: #f5f2f0;
  border-color: #f5f2f0;
  font-weight: bold;
}

.createButton2 {
  width: 100%;
}

.set-language {
  position: relative;
}

.set-language-child {
  position: absolute;
  top: 0;
  right: 0;
  background-color: gray;
  height: 30px;
  padding: 0 10px;
  text-align: center;
  line-height: 30px;
  color: white;
}

.tag {
  background-color: #393e46;
  color: #f5f2f0;
}

.delete-btn {
  position: absolute;
  top: -3px;
  right: -3px;
  background-color:#393e46;
}

.checkbox {
  width: 100px;
  display: inline-block;
  margin-top: 10px;
  border: 1px#f5f2f0 solid;
}

label{
  cursor: pointer;
  padding:5px;
  text-align: center;
  color: #f5f2f0;
}
input{
  display: none;
}
.check_box:checked + .label {
  background-color:#f5f2f0;
  color: #393e46;
}

.sitelink {
  margin-bottom: 10px;
}
</style>