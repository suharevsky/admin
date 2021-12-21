import { Response} from 'express';
import {db} from './config/firebase';

const collectionName = 'reportAbuse';

type Request = {
    body: {ids: any},
}

const getReportAbuseList = async (req: any, res: Response) => {
    try {
        const allReports: any = [];
        const querySnapshot = await db.collection(collectionName).get();
        querySnapshot.forEach((doc: any) => allReports.push(doc.data()));
        return res.status(200).json(allReports);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const deleteReportItems = async (req: Request, res: Response) => {
    const {ids} = req.body;


    try {
        const report = db.collection(collectionName).where('id', 'in', ids);

        await report.get().then(function(querySnapshot) {

            // Once we get the results, begin a batch
            const batch = db.batch();

            querySnapshot.forEach(function(doc) {
                // For each doc, add a delete operation to the batch
                batch.delete(doc.ref);
            });

            // Commit the batch
            return batch.commit();

        });


        return res.status(200).json({
            status: 'success',
            message: 'report abuse deleted successfully',
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

export {
    getReportAbuseList,
    deleteReportItems
};

