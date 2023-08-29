import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from "@/middleware/mongodb";
import Rating from "@/models/Rating";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
    ) => {
    if(req.method == 'DELETE') {

        const { id } = req.body;

        try {
            const rating = await Rating.findByIdAndDelete(id);

            if(!rating) return res.status(404).send('not_found');

            return res.status(201).json(rating);

        } catch (err) {
            console.log(err);
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
}

export default connectDB(handler);