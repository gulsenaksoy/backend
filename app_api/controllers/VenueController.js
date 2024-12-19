var mongoose = require("mongoose");
var Venue = mongoose.model("venue");


var converter = (function () {
    var earthRadius = 6371; // km
    var radian2Kilometer = function (radian) {
        return parseFloat(radian * earthRadius);
    };
    var kilometer2Radian = function (distance) {
        return parseFloat(distance / earthRadius);
    };
    return {
        radian2Kilometer,
        kilometer2Radian,
    };
})();

const createResponse = function (res, status, content) {
    res.status(status).json(content);
}

const listVenues = async function (req, res) {
    var lat = parseFloat(req.query.lat) || 0;
    var long = parseFloat(req.query.long) || 0;
    var point = { type: "Point", coordinates: [lat, long] };
    var geoOptions = { distanceField: "dis", spherical: true, maxDistance: converter.radian2Kilometer(100) };

    try {
        await Venue.aggregate([
            {
                $geoNear: {
                    near: point,
                    ...geoOptions,
                }
            }
        ]).then((result) => {
            const venues = result.map(function (venue) {
                return {
                    distance: converter.kilometer2Radian(venue.dis),
                    name: venue.name,
                    address: venue.address,
                    rating: venue.rating,
                    foodanddrink: venue.foodanddrink,
                    id: venue._id,
                };
            });
            if (venues.length > 0)
                createResponse(res, "200", venues);
            else
                createResponse(res, "200", { "status": "Civarda mekan yok" });
        });
    } catch (error) {
        createResponse(res, "404", error);
    }
};


const addVenue = async function (req, res) {
    try {
        await Venue.create({
            ...req.body,
            coordinates: [req.body.lat, req.body.long],
            // hafta içi-hafta sonu
            hours: [
                {
                    days: req.body.days1,
                    open: req.body.open1,
                    close: req.body.close1,
                    isClosed: req.body.isClosed1
                },
                {
                    days: req.body.days2,
                    open: req.body.open2,
                    close: req.body.close2,
                    isClosed: req.body.isClosed2
                }
            ]
        }).then(function (venue) {
            //oluşturulan venue içeriği
            createResponse(res, "201", venue);
        });
    } catch (error) {
        createResponse(res, "400", error);
    }
}

const getVenue = async function (req, res) {
    //createResponse(res,"200",{"status": "success"} );
    //exec sql sorgusu yapıyor
    try {
        await Venue.findById(req.params.venueid)
            .exec().then(function (venue) {
                createResponse(res, "200", venue);
            });
    } catch (error) {
        createResponse(res, "404", { "status": "Böyle bir mekan yok" });
    }
}

const updateVenue = async function (req, res) {
    try {
        const updatedVenue = await Venue.findByIdAndUpdate(req.params.venueid, {
            ...req.body,
            coordinates: [req.body.lat, req.body.long],
            // hafta içi-hafta sonu
            hours: [
                {
                    days: req.body.days1,
                    open: req.body.open1,
                    close: req.body.close1,
                    isClosed: req.body.isClosed1
                },
                {
                    days: req.body.days2,
                    open: req.body.open2,
                    close: req.body.close2,
                    isClosed: req.body.isClosed2
                },
            ],
        });
        createResponse(res, "201", updatedVenue);
    } catch (error) {
        createResponse(res, "400", { status: "Güncelleme başarısız." });
    }
};

const deleteVenue = async function (req, res) {
    try {
        await Venue.findByIdAndDelete(req.params.venueid).then(function (venue) {
            createResponse(res, "200", { status: venue.name + " isimli mekan silindi." });
        });
    } catch (error) {
        createResponse(res, "404", { status: "Böyle bir mekan yok" });
    }
};

module.exports = {
    listVenues,
    getVenue,
    addVenue,
    updateVenue,
    deleteVenue
}