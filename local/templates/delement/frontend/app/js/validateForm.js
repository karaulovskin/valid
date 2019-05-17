export default class validateForm {
    form = '[data-form]';
    formRequired = '[data-form-required]';
    inputPlaceholder = '[data-input-placeholder]';

    constructor() {
        this.bindEvents();
    }

    validate ($elem) {
        let self = this;
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

    bindEvents() {
        let self = this;

        $(document).on('focusout', this.formRequired, function () {
            self.validate($(this));

        });

        $(document).on('focusin', this.formRequired, function () {
            self.focusIn($(this));
        });

        $(document).on('submit', this.form, function () {


            return false;
        });
    }
};