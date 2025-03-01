//Go to teachable bundle course page, ex: http://nativescripting.teachable.com/p/nativescript-with-angular-ultra-bundle
//Open console and paste and execute this code. Then copy the results


///Bundle rip code
var bundleTitle = $('.course-title')[0].innerText;
var bundleSubTitle = $('.course-subtitle')[0].innerText;
var bundleDescription = $('.course-description')[0].innerText;
var bundleId = $('#fedora-data').attr('data-course-id');
var bundleUrl = bundleTitle.toLocaleLowerCase().split(' ').join('-');
var courseIds = [];
$('.course-listing.bundle').each((i, section) => {
    var idAttr = $(section).attr('data-course-url');
    var cId = idAttr.substring(idAttr.lastIndexOf('/') + 1);
    courseIds.push(cId);
});
var products = [];

let singlePrice = -1;

$('.checkout-button-group').each((i, group) => {
    var prodId = $(group).find('input[type="radio"]')[0].value;
    //var price = $(group).find('.default-product-price')[0].innerText;

    var price = parseFloat(
        $(group)
            .find('.default-product-price')[0]
            .innerText.replace('$', '')
            .replace(',', '')
    );

    if (price == 'FREE') price = 0;
    var prodName = $(group).find('.product-name')[0].innerText;
    var prodDesc = $(group).find('.description')[0].innerText;

    //var liccount = prodName.toLowerCase().indexOf('single') > -1 ? 1 : 2;
    //var licensesMin = liccount === 1 ? 1 : 2;
    //var licensesMax = liccount === 1 ? 1 : 10;

    var regex = /\d+/g;
    var matches = prodName.match(regex);

    var liccountOne = prodName.toLowerCase().indexOf('single') > -1;
    var licensesMin = liccountOne ? 1 : parseInt(matches[0]);
    var licensesMax = liccountOne ? 1 : parseInt(matches[1]);

    if (licensesMin === 1) {
        singlePrice = price;
    }

    const regPrice = licensesMin * singlePrice;

    products.push({ id: prodId, name: prodName, description: prodDesc, pricesale: price, pricereg: regPrice, licensesMin: licensesMin, licensesMax: licensesMax });
});

var bundleObj = { id: bundleId, title: bundleTitle, subtitle: bundleSubTitle, description: bundleDescription, url: bundleUrl, promototal: 100, promoremaining: 0, bundleLevel: 1, products: products, courseIds: courseIds };
console.log(JSON.stringify(bundleObj, null, 2));
