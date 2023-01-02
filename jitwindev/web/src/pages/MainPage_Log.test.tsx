import { render } from '@testing-library/react';
import { newMessage, useMessageRecords } from 'hooks/useMessageRecords';
import { mocked } from 'jest-mock';
import { MessageRecord } from 'models/MessageRecord';
import { GuiFeature } from 'mvfp/GuiFeature';
import MainPage from 'pages/MainPage';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { makeMockSessionRepository } from 'tests/testUtilities';

const mockStubUseParams = mocked(useMessageRecords);
const mockNewMessage = mocked(newMessage);
jest.mock('hooks/useMessageRecords');

describe('Log System', () => {
  it('Having log broker', () => {
    // GIVEN
    const fakeNewMessage = (message: string): MessageRecord => ({
      dateTimeReal: new Date(2023, 0, 2, 12, 0, 0),
      message,
    });
    mockNewMessage.mockImplementation(fakeNewMessage);
    const spyAddMessage = jest.fn();
    mockStubUseParams.mockReturnValue([spyAddMessage, []]);

    class FakeFeature extends GuiFeature {
      beforeRun() {
        super.beforeRun();
        this.addLog({ level: 'ERR', message: 'This is an error message' });
        this.addLog({ level: 'INF', message: 'This is an info message' });
        this.addLog({ level: 'WAR', message: 'This is a warning message' });
        this.addLog({ level: 'DBG', message: 'This is a debug message' });
      }
    }

    // WHEN
    render(
      <MemoryRouter>
        <RecoilRoot>
          <Routes>
            <Route
              path="/"
              element={
                <MainPage
                  sessionRepository={makeMockSessionRepository()}
                  features={[new FakeFeature()]}
                />
              }
            />
          </Routes>
        </RecoilRoot>
      </MemoryRouter>
    );

    // THEN
    expect(spyAddMessage).toHaveBeenCalledWith(
      fakeNewMessage('[E] This is an error message')
    );
    expect(spyAddMessage).toHaveBeenCalledWith(
      fakeNewMessage('[I] This is an info message')
    );
    expect(spyAddMessage).toHaveBeenCalledWith(
      fakeNewMessage('[W] This is a warning message')
    );
    expect(spyAddMessage).toHaveBeenCalledWith(
      fakeNewMessage('[D] This is a debug message')
    );
  });
});
