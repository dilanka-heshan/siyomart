import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    image: { type: String, required: true },
    productCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    displayOrder: { type: Number },
}, {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
    collection: 'category' // Explicitly set the collection name to match your MongoDB
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);