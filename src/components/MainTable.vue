<template>
  <div class="pa-2 table">
    <div id="capture">
      <div class="d-flex flex-row">
        <div class="header px-3 py-1" v-for="(header, index) in headers"
             @click="header.value === 'update' && refreshValues()"
             :class="header.class" :key="index"><b>{{ header.text }}</b></div>
      </div>
      <div class="d-flex flex-row underline" v-for="(item, index) in data" :key="index">
        <template v-if="item.type && item.type === 'category'">
          <div class="category px-3 py-1">{{ item.name }}</div>
        </template>
        <template v-else>
          <div class="first-column px-3 py-1">
            <template v-if="item.description && item.description.length">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span class="pointer"
                        v-bind="attrs"
                        v-on="on"
                  >{{ item.name }}</span>
                </template>
                <div style="text-align: left" v-html="item.description"></div>
              </v-tooltip>
            </template>
            <span v-else>{{ item.name }}</span>
          </div>
          <div class="input-column px-3 py-1 d-flex flex-row align-center">
            <input max="6" min="0"
                   type="number"
                   disabled
                   placeholder="0"
                   class="input-style"
                   v-model="item.amount"
            />
            <v-btn class="mx-0 align-self-center"
                   @click="decreaseAmount(item)"
                   icon
                   x-small><b class="btn-font minus">-</b></v-btn>
            <v-btn class="mx-0 align-self-center"
                   @click="increaseAmount(item)"
                   icon
                   x-small><b class="btn-font plus">+</b></v-btn>
          </div>
          <div class="other-column px-3 py-1 align-self-center"
               :class="{'green-colored': Math.floor(item.amount) > i && item.category == 1,
                      'red-colored': Math.floor(item.amount) > i && item.category == 2,
                      'low': item.category == 2,
                      'high': item.category == 1,
                      half: Math.floor(item.amount) !== item.amount && item.amount > i && item.amount < i + 1}"
               v-for="(value, i) in item.values" :key="i">{{ value }}
          </div>
        </template>
      </div>
      <div class="d-flex flex-row">
        <div class="category diverse-row px-3 py-1 d-flex flex-row">
          <div class="diverse-column"><b>Разнообразие:</b></div>
          <div class="input-column--diversity d-flex flex-row align-center justify-center">
            <label for="vegs">овощей:</label>
            <input type="checkbox"
                   :disabled="data[1].amount == 0"
                   id="vegs"
                   class="input-style"
                   v-model="diverseVegs"
            />

          </div>
          <div class="input-column--diversity d-flex flex-row align-center justify-center">
            <label for="fruits">фруктов:</label>
            <input type="checkbox"
                   :disabled="data[2].amount == 0"
                   id="fruits"
                   class="input-style"
                   v-model="diverseFruits"
            />
          </div>
        </div>
      </div>
      <div class="category px-3 py-1 d-flex flex-row">
        <b class="align-center pt-1" @click="calcDQS">DQS:</b>
        <v-spacer/>
        <b class="px-3 pt-1 align-center">{{ dqs }}</b>
        <v-btn class="btn-aligning" dense small depressed download="dqs-calc.png" @click="takeSS">Сохранить</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {Component, Vue, Watch} from "vue-property-decorator";
import html2canvas from 'html2canvas';
import electron from 'electron';
// import {app} from 'electron';
import fs from 'fs';
import path from 'path';

@Component({
  name: "MainTable",
})

export default class MainTable extends Vue {
  headers = [
    {
      text: 'Количество порций в день',
      value: 'name',
      class: 'first-column',
    }, {
      text: '⭮',
      class: 'input-column pointer',
      value: 'update'
    }, {
      text: '1',
      class: 'other-column',
    }, {
      text: '2',
      class: 'other-column',
    }, {
      text: '3',
      class: 'other-column',
    }, {
      text: '4',
      class: 'other-column',
    }, {
      text: '5',
      class: 'other-column',
    }, {
      text: '6',
      class: 'other-column',
    },
  ];
  data = [
    {
      name: 'Высококачественные продукты',
      type: 'category',
    },
    {
      name: 'Овощи, бобовые, грибы, зелень',
      category: '1',
      values: ['+2', '+2', '+2', '+1', '0', '0'],
      amount: 0,
      description: 'Порция: 1 кулак или 1 шт',
    }, {
      name: 'Фрукты, ягоды',
      category: '1',
      values: ['+2', '+2', '+2', '+1', '0', '0'],
      amount: 0,
      description: 'Порция: 1 кулак или 1 шт',
    }, {
      name: 'Орехи, семена, полезные масла',
      category: '1',
      values: ['+2', '+2', '+1', '0', '0', '-1'],
      amount: 0,
      description: 'Порция: Орехи - жменя, <br /> Семечки - столовая ложка, <br /> Масло - столовая ложка "с горкой"',
    }, {
      name: 'Цельнозерновые крупы и мука',
      category: '1',
      values: ['+2', '+2', '+1', '0', '0', '-1'],
      amount: 0,
      description: 'Порция: 1 кулак или полная жменя в готовом виде',
    }, {
      name: 'Молочные продукты',
      category: '1',
      values: ['+2', '+1', '+1', '0', '-1', '-2'],
      amount: 0,
      description: 'Порция: для жидкого - условный кулак, <br /> мягкий сыр - 4 пальца, <br /> твердый сыр - 2 пальца',
    }, {
      name: 'Цельные мясо/птица/рыба и яйца',
      category: '1',
      values: ['+2', '+1', '+1', '0', '-1', '-2'],
      amount: 0,
      description: 'Порция: ладонь без пальцев, можно больше',
    }, {
      name: 'Высококачественные напитки',
      category: '1',
      values: ['+1', '+1', '0', '0', '-1', '-2'],
      amount: 0,
      description: '',
    }, {
      name: 'Высококачественная обработанная еда',
      category: '1',
      values: ['+1', '0', '-1', '-2', '-2', '-2'],
      amount: 0,
      description: '',
    }, {
      name: 'Низкокачественные продукты',
      type: 'category',
    }, {
      name: 'Очищенные зерна и мука твердых сортов',
      category: '2',
      values: ['0', '-1', '-2', '-2', '-2', '-2'],
      amount: 0,
      description: 'Порция: жменя/кулак',
    }, {
      name: 'Сладости',
      category: '2',
      values: ['-2', '-2', '-2', '-2', '-2', '-2'],
      amount: 0,
      description: '',
    }, {
      name: 'Ультрапереработанная еда',
      category: '2',
      values: ['-2', '-2', '-2', '-2', '-2', '-2'],
      amount: 0,
      description: '',
    }, {
      name: 'Жареная еда',
      category: '2',
      values: ['-2', '-2', '-2', '-2', '-2', '-2'],
      amount: 0,
      description: '',
    }, {
      name: 'Низкокачественные напитки',
      category: '2',
      values: ['-2', '-2', '-2', '-2', '-2', '-2'],
      amount: 0,
      description: '',
    }, {
      name: 'Прочее',
      category: '2',
      values: ['0', '-1', '-2', '-2', '-2', '-2'],
      amount: 0,
      description: '',
    },
  ];
  dqs = 0;
  diverseFruits = false;
  diverseVegs = false;
  showSnackbar = false;

  takeSS() {
    let image;
    const dialog = electron.remote.dialog;
    html2canvas(document.querySelector("#capture")).then(canvas => {
      image = canvas.toDataURL('image/jpeg', 1);
      const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
      let filePath = electron.app || electron.remote.app;
      filePath = filePath.getPath('documents') + '\\DQS screenshots';
      const fileName = 'dqs-calc ' + new Date().toLocaleDateString('ru') + '.jpeg';
      if (!fs.existsSync(filePath)) fs.mkdir(filePath, (err) => {
        console.log(err)
      });
      console.log(filePath)
      dialog.showSaveDialog({
        title: 'Выберите путь для сохранения',
        defaultPath: path.join(filePath, fileName),
        filters: [
          {
            name: 'Изображение',
            extensions: ['jpeg']
          }, ],
        properties: []
      }).then(file => {
        console.log(file.canceled);
        if (!file.canceled) {
          console.log(file.filePath.toString());
          fs.writeFile(file.filePath.toString(), base64Data, 'base64', (err) => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      });
    });
  }

  @Watch('diverseFruits')
  changeDqsByFruits() {
    if (this.diverseFruits) {
      this.dqs = this.dqs + 0.5
    } else {
      this.dqs = this.dqs - 0.5
    }
  }

  @Watch('diverseVegs')
  changeDqsByVegs() {
    if (this.diverseVegs) {
      this.dqs = this.dqs + 0.5
    } else {
      this.dqs = this.dqs - 0.5
    }
  }

  calcDQS() {
    let dqs = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].values && this.data[i].values.length && this.data[i].amount) {
        for (let j = 0; j < this.data[i].amount; j++) {
          if (this.data[i].amount !== Math.floor(this.data[i].amount) && j === Math.floor(this.data[i].amount)) {
            dqs = dqs + +this.data[i].values[j] * (this.data[i].amount - Math.floor(this.data[i].amount))
          } else {
            dqs = dqs + +this.data[i].values[j];
          }
        }
      }
    }
    this.dqs = dqs;
  }

  increaseAmount(item) {
    if (item.amount && item.amount < 6 && item.amount > 5.5) {
      item.amount = 6;
    } else if (!item.amount || (item.amount && item.amount < 5.5)) {
      item.amount = item.amount + 0.5;
    }
    this.calcDQS();
  }

  decreaseAmount(item) {
    if (item.amount && item.amount >= 0.5) {
      item.amount = item.amount - 0.5;
    } else if (!item.amount || (item.amount && item.amount < 0.5)) {
      item.amount = 0
    }
    this.calcDQS();
  }

  refreshValues() {
    this.dqs = 0;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].amount && this.data[i].amount > 0) {
        this.data[i].amount = 0;
      }
    }
  }
}
</script>
<style>
.v-tooltip__content {
  background: #424242 !important;
  opacity: 1 !important;
}
</style>
<style scoped lang="scss">
.first-column {
  text-align: left;
  min-width: 300px;
}

.other-column {
  text-align: center;
  width: 10%;
  max-width: 100px;
  min-width: 50px;
}

.header {
}

.table {
  color: #bdbdbd;
  max-width: 900px;
  width: fit-content;
}

.category {
  width: 100%;
  text-align: left;
  background: #424242;
  color: #eee
}

.underline {
  border-bottom: 1px solid #424242;
}

.input-style {
  width: 30px;
  text-align: center;
  color: #bdbdbd;
}

.input-column {
  min-width: 94px;

  &--diversity {
    width: 30%;
    text-align: center;
  }
}

input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  height: 0;
  opacity: 0;
}

.btn-font {
  font-size: 16px;
}

.minus {
  margin-bottom: 2px;
  color: #cc1919;
}

.plus {
  margin-top: 1px;
  color: green;
}

.green-colored {
  background: green;
}

.red-colored {
  background: #811010;
}

.half {
  &.high {
    background: linear-gradient(to right, green 30%, #121212 80%);
  }

  &.low {
    background: linear-gradient(to right, #811010 30%, #121212 80%);
  }
}

.pointer {
  cursor: pointer;

  &:hover {
    color: #eee;
  }
}

.diverse-column {
  width: 40%;
}

#capture {
  background: #121212;
}

.diverse-row {
  border-bottom: 1px solid #bdbdbd;
}
</style>