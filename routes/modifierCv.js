/**
 * Created by Antoine Delahaye on 24/02/2016.
 */

var models  = require('../models');
var express = require('express');
var router = express.Router();
var global =0;
//Liste des mois
var mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

/* GET home page. */
router.get('/:idCv', function(req, res, next) {
    /*On recherche le cv qui doit etre modifier*/
    models.CV.findOne({
        where:{id: req.params.idCv},
        include:[{model: models.Competence_CV},
            {model: models.Candidat},
            {model: models.Langue},
            {model: models.Centre_interet},
            {model: models.Experience_pro, include : [{model: models.Mission_CV}, {model: models.Contrat_type}]},
            {model: models.Formation}
        ]
    }).then(function(cv){
        //console.log(JSON.stringify(cv));
        res.render('modifierCv', { title: 'Modification du CV', cv: cv, mois: mois, session: req.session, cvid: cv.id});
    });
});


router.post('/', function (req, res) {
    console.log((JSON.stringify(req.body)));

    /* On recherche le cv dans la base puis on modifie les infos*/
    models.CV.findOne( {
        where:{id: req.body.cvid},
        include:[{model: models.Competence_CV},
            {model: models.Candidat},
            {model: models.Langue},
            {model: models.Centre_interet},
            {model: models.Experience_pro, include : [{model: models.Mission_CV}, {model: models.Contrat_type}]},
            {model: models.Formation}
        ]
    }).then(function(cv) {
        if (req.body.oldresume != req.body.resumeCv){
            cv.update({
                resume: req.body.resumeCv
            })
        }
    });

    /* En construction...*/
    var i;
    var tailleformation = req.body.tailleformation;
   for ( i = 0; i< tailleformation;i++){
       console.log(i+"test")
       console.log(req.body.formation[i].id+ " YOOO"); // undefined
        models.Formation.findOne( {
            where: {cvId: req.body.cvid, id: req.body.formation[i].id},
            include:[{model: models.CV}]
        }).then(function(formation) {
            //var i=0;
            var yo = "req.body.Formation_"+i+"_anneeFormation";
            console.log(yo + " et voici la nouvelle année "+ req.body.formation[i].annee);
               /* if (req.body.oldanneeFormation[i] != req.body.anneeFormation[i]){
                    console.log(req.body.oldanneeFormation[i] + " et voici la nouvelle année "+ req.body.anneeFormation[i]);
                    formation.update({
                        annee: parseInt(req.body.anneeFormation[i])
                    });
                }*/
               // i++;
        });
        global = global+1;
    }

});




module.exports = router;
