const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tournament must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        250,
        'A tournament name must have less or equal then 250 characters',
      ],
      minlength: [
        10,
        'A tournament name must have more or equal then 10 characters',
      ],
      // validate: [validator.isAlpha, 'tournament name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tournament must have a duration'],
    },
    maxPlayers: {
      type: Number,
      required: [true, 'A tournament must have a maximum number of players'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tournament must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tournament must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tournament must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tournament must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secrettournament: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tournamentSchema.index({ price: 1 });
// tournamentSchema.index({ price: 1, ratingsAverage: -1 });
// tournamentSchema.index({ slug: 1 });
// tournamentSchema.index({ startLocation: '2dsphere' });

tournamentSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
// tournamentSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'tournament',
//   localField: '_id',
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tournamentSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tournamentSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tournamentSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tournamentSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tournamentSchema.pre('find', function(next) {
tournamentSchema.pre(/^find/, function (next) {
  this.find({ secrettournament: { $ne: true } });

  this.start = Date.now();
  next();
});

tournamentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// tournamentSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// tournamentSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secrettournament: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
