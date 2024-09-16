


class SiteController{
    // [GET /trangchu]
    index(req, res) {
        const id = req.params.id;
        res.render('home')
    }

    // [GET/ login]
    login(req, res) {
        res.render('login')
    }
}


module.exports =  new SiteController;