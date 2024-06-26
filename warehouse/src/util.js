import 'materialize-css/dist/js/materialize.min.js'

export default {
  initView(isForm) {
    setTimeout(() => this.initPage(isForm)) //waiting for the next DOM update flush
  },
  initPage(isForm) {
    window.M.FormSelect.init(document.querySelectorAll('select'))
    if (isForm) {
      this.setSearchParams()
      this.maskInput()
      let firstInput = document.querySelector(
        'form input:not([type=hidden]):not([readonly]), form select:not([readonly])'
      )
      if (firstInput) {
        firstInput.focus()
      }
    } else {
      this.searchChange()
    }
  },
  maskInput() {
    let types = {
      date: { date: true, datePattern: ['m', 'd', 'Y'], delimiter: '/' },
      time: { time: true, timePattern: ['h', 'm', 's'], delimiter: ':' },
      datetime: {
        numericOnly: true,
        delimiters: ['/', '/', ' ', ':', ':'],
        blocks: [2, 2, 4, 2, 2, 2]
      }
    }
    document.querySelectorAll('input[data-type]').forEach((e) => {
      //https://github.com/nosir/cleave.js/issues/138
      let type = e.getAttribute('data-type')
      let cleave = new window.Cleave(e, types[type])
      e._cleave = cleave
    })
    let locale = {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      monthsShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      today: 'Today',
      clear: 'Clear',
      firstDay: 0
    }
    let dateFormat = {
      date: 'MM/DD/YYYY',
      time: 'HH:mm:ss',
      datetime: 'MM/DD/YYYY HH:mm:ss'
    }
    let pickerType = {
      date: {
        locale,
        dateFormat: (date) => {
          return window.moment(date).format(dateFormat.date)
        }
      },
      time: {
        locale,
        timepicker: true,
        onlyTimepicker: true,
        dateFormat: (date) => {
          return window.moment(date).format(dateFormat.time)
        }
      },
      datetime: {
        locale,
        timepicker: true,
        dateFormat: (date) => {
          return window.moment(date).format(dateFormat.datetime)
        }
      }
    }
    document.querySelectorAll('input[data-type]').forEach((e) => {
      let type = e.getAttribute('data-type')
      let option = { ...pickerType[type] }
      let picker = new window.AirDatepicker(e, option)
      e._airpicker = picker
      picker.opts.onShow = (isFinished) => {
        if (isFinished) {
          let date = window.moment(e.value, dateFormat[type])
          if (date.isValid()) {
            picker.setViewDate(date)
            picker.selectDate(date, { updateTime: true, silent: true })
          }
        }
      }
      picker.opts.onSelect = () => {
        e.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
  },
  unmaskInput() {
    document.querySelectorAll('input[data-type]').forEach((e) => {
      e._cleave.destroy()
      e._airpicker.destroy()
    })
  },
  setSearchParams() {
    if (location.pathname.toLowerCase().endsWith('create')) {
      new URLSearchParams(location.search).forEach((value, key) => {
        let element = document.getElementById(key) || document.getElementById(key + value)
        if (element) {
          if (element.tagName == 'INPUT') {
            if (element.type == 'radio') {
              element.click()
              document.querySelectorAll(`[id^="${key}"]`).forEach((e) => {
                e.parentElement.classList.add('readonly')
              })
            } else {
              Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(
                element,
                value
              )
              element.dispatchEvent(new Event('input', { bubbles: true }))
            }
          } else {
            element.value = value
            window.M.FormSelect.init(element, { classes: 'readonly' })
            element.dispatchEvent(new Event('change', { bubbles: true }))
          }
          element.setAttribute('readonly', '')
        }
      })
    }
  },
  clearSearch() {
    document.getElementById('search_word').value = ''
    let index = location.search.indexOf('?sw=')
    if (index < 0) {
      index = location.search.indexOf('&sw=')
    }
    if (index >= 0) {
      let url = location.pathname + location.search.substr(0, index)
      this.$router.push(url)
    }
  },
  search(e) {
    if (!e || e.keyCode == 13) {
      let searchWord = document.getElementById('search_word')
      let value = searchWord.value
      if (value) {
        let search = `sw=${value}&sc=${document.getElementById('search_col').value}&so=${document.getElementById('search_oper').value}`
        let query =
          !location.search || location.search.substr(0, 4) == '?sw='
            ? `?${search}`
            : `${location.search.split('&sw=')[0]}&${search}`
        let matches = query.match(/page=\d+/)
        if (matches) {
          query = query.replace(matches[0], 'page=1')
        }
        let url = location.pathname + query
        this.$router.push(url)
      } else {
        searchWord.focus()
      }
    }
  },
  searchChange() {
    let searchWord = document.getElementById('search_word')
    if (searchWord.getAttribute('data-type')) {
      this.unmaskInput()
      searchWord.outerHTML = searchWord.outerHTML.toString() //remove all mask/datepicker custom event listeners
      searchWord = document.getElementById('search_word')
      searchWord.addEventListener('keyup', this.search)
    }
    let type =
      document.getElementById('search_col').selectedOptions[0].getAttribute('data-type') || 'text'
    if (type == 'date' || type == 'time' || type == 'datetime') {
      searchWord.setAttribute('type', 'text')
      searchWord.setAttribute('data-type', type)
      this.maskInput()
    } else {
      searchWord.setAttribute('type', type)
      searchWord.removeAttribute('data-type')
    }
    let searchOper = document.getElementById('search_oper')
    let disabled = type != 'text'
    searchOper.options[0].disabled = disabled
    if (disabled && searchOper.selectedIndex == 0) {
      searchOper.selectedIndex = 1
    }
    if (document.activeElement.id == 'search_col') {
      searchWord.select()
    }
    window.M.FormSelect.init(searchOper) //https://github.com/Dogfalo/materialize/issues/4685
  },
  validateForm() {
    let password = document.querySelector('input[type=password]:not([data-match])')
    let match = document.querySelector('[data-match]')
    if (!password.value && (!match || !match.value)) {
      //do not change password
      return true
    }
    let passwordError = this.validatePassword(password.value)
    let isPasswordMatch = true
    if (match) {
      isPasswordMatch =
        document.getElementById(match.getAttribute('data-match')).value == match.value
    }
    if (passwordError) {
      alert(passwordError)
    } else if (!isPasswordMatch) {
      alert('Password do not match!')
    }
    let isFormValid = !passwordError && isPasswordMatch
    return isFormValid
  },
  validatePassword(value) {
    let error = ''
    if (!/[a-z]/.test(value)) {
      error += 'Must include lowercase letter\n'
    }
    if (!/[A-Z]/.test(value)) {
      error += 'Must include uppercase letter\n'
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      error += 'Must include symbol\n'
    }
    if (!/[0-9]/.test(value)) {
      error += 'Must include number\n'
    }
    if (value.length < 6 || value.length > 10) {
      error += 'Must have length between 6 and 10'
    }
    if (error) {
      error = 'Password does not meet requirements:\n' + error
    }
    return error
  },
  getRef(path) {
    let ref = path
    let query = this.$route.query
    let prev = this.$router.options.history.state.back
    if (query.ref) {
      ref = query.ref
    } else if (prev && !query.back) {
      ref = prev
    }
    if (!ref.includes('back=1')) {
      ref += (ref.includes('?') ? '&' : '?') + 'back=1'
    }
    return ref
  },
  getLink(type, value, sort = '') {
    let query = this.$route.query
    let paging = this.paging
    let link = ''
    if (type == 'sort') {
      link =
        '?page=' +
        paging.current +
        '&size=' +
        paging.size +
        '&sort=' +
        value +
        ((query.sort == value || (!query.sort && sort == 'asc')) && !query.desc ? '&desc=1' : '')
    } else if (type == 'page') {
      link =
        '?page=' +
        value +
        '&size=' +
        paging.size +
        (query.sort ? '&sort=' + query.sort + (query.desc ? '&desc=1' : '') : '')
    } else if (type == 'size') {
      link =
        '?page=1&size=' +
        value +
        (query.sort ? '&sort=' + query.sort + (query.desc ? '&desc=1' : '') : '')
    }
    link += query.sw ? '&sw=' + query.sw + '&sc=' + query.sc + '&so=' + query.so : ''
    return link
  },
  getSortClass(column, sort = '') {
    let query = this.$route.query
    return query.sort == column || (!query.sort && sort)
      ? query.sort
        ? query.desc
          ? 'sort desc'
          : 'sort asc'
        : `sort ${sort}`
      : 'sort'
  },
  getFormData(data) {
    return Object.keys(data).reduce((form, key) => {
      if (data[key] !== null && data[key] !== undefined) {
        form.append(key, data[key])
      }
      return form
    }, new FormData())
  },
  getString(bytes) {
    return bytes ? atob(bytes).replace(/\0/g, '') : bytes
  }
}
