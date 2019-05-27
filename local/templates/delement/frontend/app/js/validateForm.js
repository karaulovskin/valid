export default class validateForm {
    form = '[data-form]';
    formRequired = '[data-form-required]';
    inputPlaceholder = '[data-input-placeholder]';

    constructor() {
        this.bindEvents();
    }

    focusIn ($elem) {
        if (!$elem.hasClass('invalid')) {
            let placeholderVal = $elem.attr('placeholder');
            $elem.attr('data-input-placeholder', placeholderVal);
        } else {
            let saveValue = $elem.attr('data-input-placeholder');
            $elem.attr('placeholder', saveValue);
        }
    }

    invalid ($elem) {
        if (!$elem.hasClass('invalid')) {
            $elem.addClass('invalid');
            $elem.siblings('.check-valid').remove();
            $elem.closest('div').append('<div class="check-invalid"></div>');
            this.placeholderInvalid($elem);
        }
    }

    valid ($elem) {
        $elem.removeClass('invalid');
        $elem.addClass('valid');
        $elem.siblings('.check-invalid').remove();
        $elem.closest('div').append('<div class="check-valid"></div>');
    }

    placeholderInvalid ($elem) {
        $elem.attr('placeholder', 'Поле не заполнено');
    }

    validateInput ($elem) {
        let type = $elem.attr('type');
        let checkResult = true;
        switch (type) {
            case 'email':
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

                if (!re.test($elem.val())) {
                    this.invalid($elem);
                    checkResult = false;
                } else {
                    this.valid($elem)
                }

                break;
            case 'phone':
                var cleanPhone = $elem.val().replace(/\s/g, "");
                var re = /^[+]7*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

                if (!re.test(cleanPhone)) {
                    this.invalid($elem);
                    checkResult = false;
                } else {
                    this.valid($elem);
                }

                break;
            case 'dropdown':

                break;
            case 'password':

                break;
            default:

                if ($.trim($elem.val()) === ''){
                    this.invalid($elem);
                    checkResult = false;
                } else {
                    this.valid($elem)
                }

                break;
        }

        return checkResult;
    }

    validate ($form) {
        let self = this;
        let $inputs = $form.find($(this.formRequired));
        let inputsAmount = $inputs.length;
        let validCount = 0;

        $inputs.each(function() {
            if ($(this).hasClass('valid')) {
                validCount++
            } else {
                self.invalid($(this));
            }
        });

        return new Promise((resolve, reject) => {
            if (inputsAmount === validCount) {
                resolve(this.formSend($form));

            } else {
                reject(console.log('форма не валидна!'));
            }
        });
    }

    formSend ($form) {
        let self = this;
        let formData = new FormData($form[0]);
        let url = '/test.json';
        let p = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('Get', url);
            xhr.responseType = 'json';
            xhr.addEventListener('load', () => {
                resolve(xhr.response);
            });
            xhr.addEventListener('error', () => {
                reject();
            });
            xhr.send();
        });
        return p.then((response) => {
            console.log('файл загружен!');
            $form[0].reset();
            $form.find($('.check-valid')).remove();

            return response;
        });
    }

    bindEvents() {
        let self = this;

        $(document).on('focusout', this.formRequired, function () {
            self.validateInput($(this));
        });

        $(document).on('focusin', this.formRequired, function () {
            self.focusIn($(this));
        });

        $(document).on('submit', this.form, function () {
            self.validate($(this)).then((response) => {
                console.log(response);
            });
            return false;
        });
    }
};