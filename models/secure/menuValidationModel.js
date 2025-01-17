const Yup = require('yup');

//* validate for UI by Yup
const schema = Yup.object().shape({
    title: Yup.string().required('عنوان الزامی است').min(4, 'عنوان نباید کمتر از 3 کاراکتر باشد.').max(255, 'عنوان نباید بیشتر از 100 کاراکتر باشد.'),
    // subMenu: Yup.string().required('منو باید دارای زیر منو باشد .'),
    thumbnail:Yup.object().shape({
        name:Yup.string().required('عکس برای منو الزامی می باشد'),
        size:Yup.number().max(3000000,'عکس نباید بیشتر از 3 مگابایت باشد.'),
        mimType:Yup.mixed().oneOf(['image/jpeg','image/png'],'فقط پسوند های jpg و png پشتیبانی میشود.')
    })
});

module.exports = {
    schema
}
