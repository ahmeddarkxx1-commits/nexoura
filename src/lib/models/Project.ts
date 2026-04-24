import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [{
      type: String, // Cloudinary URLs
    }],
    category: {
      type: String,
      required: true,
    },
    previewLink: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: [{
      type: String,
    }],
  },
  { timestamps: true }
);

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
