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
        $elem.addClass('invalid');
        $elem.closest('div').append('<div class="check-invalid"></div>');
        this.placeholderInvalid($elem);
    }

    valid ($elem) {
        $elem.removeClass('invalid');
        $elem.addClass('valid');
        $elem.closest('div').append('<div class="check-valid"></div>');
    }

    placeholderInvalid ($elem) {
        $elem.attr('placeholder', 'Поле не заполнено');
    }

    validateInput ($elem) {
        let type = $elem.attr('type');

        switch (type) {
            case 'email':
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

                if (!re.test($elem.val())) {
                    this.invalid($elem)
                } else {
                    this.valid($elem)
                }

                break;
            case 'phone':
                var cleanPhone = $elem.val().replace(/\s/g, "");
                var re = /^[+]7*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

                if (!re.test(cleanPhone)) {
                    this.invalid($elem)
                } else {
                    this.valid($elem)
                }

                break;
            case 'dropdown':

                break;
            case 'password':

                break;
            default:

                if ($.trim($elem.val()) === ''){
                    this.invalid($elem)
                } else {
                    this.valid($elem)
                }

                break;
        }
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

        let validateForm = new Promise((resolve, reject) => {
            if (inputsAmount === validCount) {
                resolve();
            } else {
                reject();
            }
        });

        validateForm.then(
            () => {
                console.log('форма валидна!');
                return this.formSend();
            },
            () => {
                console.log('форма не валидна!');
            }
        );
    }

    formSend () {

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
            self.validate($(this));
            return false;
        });
    }
};