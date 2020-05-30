import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1',
    });

    expect(appointment).toHaveProperty('id');
  });
  it('should not be able to create two appointment on the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const dateAppointment = new Date();

    await createAppointment.execute({
      date: dateAppointment,
      provider_id: '1',
    });

    expect(
      createAppointment.execute({
        date: dateAppointment,
        provider_id: '2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});