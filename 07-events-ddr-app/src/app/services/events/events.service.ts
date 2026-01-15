import { inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import { IEvent } from '../../models/event.model';
import moment from 'moment';
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';

class QueryConstraint {
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {

  private readonly afApp: FirebaseApp = inject(FirebaseApp);
  private readonly firestore = getFirestore(this.afApp);

  private readonly COLLECTION_NAME = 'events';

  async createEvent(event: IEvent) {
    const eventsCollection = collection(this.firestore, this.COLLECTION_NAME);
    const newEventRef = doc(eventsCollection);
    event.id = newEventRef.id;
    await setDoc(newEventRef, event)
  }

  getFutureEvents(type?: string) {
    const queryConstraints = [
      orderBy('start', 'asc'),
      where('start', '>=', moment().format('YYYY-MM-DDTHH:mm'))
    ];
    if(type) {
      queryConstraints.push(
        where('type', '==', type)
      );
    }
    const queryDB = query(collection(this.firestore, this.COLLECTION_NAME), ...queryConstraints);

    return getDocs(queryDB).then((querySnapshot/*: QuerySnapshot<DocumentData, DocumentData>*/) => {
      const events: IEvent[] = [];
      querySnapshot.forEach((doc/*: QueryDocumentSnapshot<DocumentData, DocumentData>*/) => {
        const data = doc.data() as IEvent;
        events.push(data);
      })
      return events;
    });
  }

  getEventById(id: string) {
    const eventRef = doc(this.firestore, `${this.COLLECTION_NAME}/${id}`);
    return getDoc(eventRef).then((doc) => {
      return doc.data() as IEvent;
    });
  }

  async updateEvent(event: IEvent) {
    const eventRef = doc(this.firestore, `${this.COLLECTION_NAME}/${event.id}`);
    await setDoc(eventRef, event);
  }

  async deleteEvent(id: string) {
    const eventRef = doc(this.firestore, `${this.COLLECTION_NAME}/${id}`);
    await deleteDoc(eventRef);
  }
}
